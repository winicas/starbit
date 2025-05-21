from rest_framework import viewsets
from .models import Client, Conteneur, ContratGroupage, Produit, Paiement
from .serializers import ClientSerializer, ConteneurSerializer, ContratGroupageSerializer, ProduitSerializer, PaiementSerializer
############# Nouveau Systeme avec Next js et API##########################################
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer
from django.contrib.auth import authenticate

class LoginAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data

            # Générer les tokens JWT
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            # Renvoyer les tokens et les informations utilisateur
            return Response({
                'token': access_token,
                'refresh': refresh_token,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'role': user.role,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                }
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

########################### SUPERUSER ADMINISTRATEUR DE TOUT LE SYSTEME###########################
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from .models import Client, Conteneur, ContratGroupage, Produit, Paiement
from django.db.models import Sum

class AdminDashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            raise PermissionDenied("Vous n'avez pas accès à cette ressource.")

        data = {
            "clients_count": Client.objects.count(),
            "conteneurs_count": Conteneur.objects.count(),
            "contrats_count": ContratGroupage.objects.count(),
            "produits_count": Produit.objects.count(),
            "paiements_total": float(Paiement.objects.filter(statut='payé').aggregate(total=Sum('montant'))['total'] or 0),
            "paiements_en_attente": float(Paiement.objects.filter(statut='en_attente').aggregate(total=Sum('montant'))['total'] or 0),
        }

        return Response(data)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "first_name": user.first_name,
            "last_name": user.last_name,
            "profile_picture": request.build_absolute_uri(user.profile_picture.url) if user.profile_picture else None,
        })

# views.py
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import UpdateUserProfileSerializer

class UserProfileUpdateView(RetrieveUpdateAPIView):
    serializer_class = UpdateUserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.password_validation import validate_password

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.password_validation import validate_password

from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.exceptions import TokenError

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not user.check_password(current_password):
            return Response({"error": "Mot de passe actuel incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(new_password, user=user)
            user.set_password(new_password)
            user.save()

            # ✅ Invalider tous les tokens (déconnexion forcée)
            try:
                tokens = OutstandingToken.objects.filter(user=user)
                for token in tokens:
                    BlacklistedToken.objects.get_or_create(token=token)
            except Exception as e:
                # Optionnel : log ou ignorer selon tes besoins
                pass

            return Response({"message": "Mot de passe modifié. Vous allez être déconnecté."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

#----------------Creation de l'Ecole par superuser-------------------------------------------
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

#-------------------- Creer le Directeur d'une Ecole ----------------------------------------------

from .serializers import DirecteurSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import get_user_model
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

User = get_user_model()

class CreateDirecteurAPIView(APIView):
    permission_classes = [permissions.IsAdminUser]  # ou IsAuthenticated + custom
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        data = request.data
        username = data.get('username')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')
        profile_picture = data.get('profile_picture')

        if not all([username, first_name, last_name, email, password]):
            return Response({"error": "Tous les champs sont requis."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Ce nom d'utilisateur est déjà utilisé."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password,
            role='directeur'
        )

        if profile_picture:
            user.profile_picture = profile_picture
            user.save()

        return Response({"message": "Directeur créé avec succès."}, status=status.HTTP_201_CREATED)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh_token")

        if not refresh_token:
            return Response({"error": "Token requis"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Déconnexion réussie"}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({"error": "Token invalide ou déjà blacklisté"}, status=status.HTTP_400_BAD_REQUEST)

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]


class ConteneurViewSet(viewsets.ModelViewSet):
    queryset = Conteneur.objects.all()
    serializer_class = ConteneurSerializer

class ContratGroupageViewSet(viewsets.ModelViewSet):
    queryset = ContratGroupage.objects.all()
    serializer_class = ContratGroupageSerializer

class ProduitViewSet(viewsets.ModelViewSet):
    queryset = Produit.objects.all()
    serializer_class = ProduitSerializer

class PaiementViewSet(viewsets.ModelViewSet):
    queryset = Paiement.objects.all()
    serializer_class = PaiementSerializer
