from rest_framework import serializers
from .models import Client, Conteneur, ContratGroupage, Produit, Paiement,User


from django.contrib.auth import authenticate

import logging
logger = logging.getLogger(__name__)

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return {'user': user}
        logger.warning(f"Échec login pour {data.get('username')}")
        raise serializers.ValidationError("Identifiants incorrects")


from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

# serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password', 'role', 'profile_picture']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

# serializers.py
from rest_framework import serializers
from .models import User

class UpdateUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'profile_picture']
        read_only_fields = ['username']



class DirecteurSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)
    # Serializer pour représenter l'école associée

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password1', 'password2',  'role')
        extra_kwargs = {
            'role': {'default': 'directeur', 'write_only': True},  # Fixe le rôle par défaut à 'directeur'
        }

    def validate(self, data):
        # Vérifie si les mots de passe correspondent
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})

        # Valide le mot de passe selon les règles de Django
        try:
            validate_password(data['password1'])
        except ValidationError as e:
            raise serializers.ValidationError({'password1': list(e.messages)})
        return data

    def create(self, validated_data):
        # Supprime les champs spécifiques au serializer
        password1 = validated_data.pop('password1')
        password2 = validated_data.pop('password2')
        ecole_id = validated_data.pop('ecole_id')

        # Crée l'utilisateur avec les données validées
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=password1,
            role='directeur',
            is_staff=True
        )
        return user
    
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers

class ComptableSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)
    # Champ pour recevoir l'ID de l'école
     # Serializer pour représenter l'école associée

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password1', 'password2', 'role')
        extra_kwargs = {
            'role': {'default': 'comptable', 'write_only': True},  # Fixe le rôle par défaut à 'comptable'
        }

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({"password2": "Les mots de passe ne correspondent pas."})

        try:
            validate_password(data['password1'])  # Validez le mot de passe selon les règles de Django
        except ValidationError as e:
            raise serializers.ValidationError({'password1': list(e.messages)})

        return data

    def create(self, validated_data):
        password = validated_data.pop('password1')
        validated_data.pop('password2')
      
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=password,
            role='comptable',
            is_staff=True
        )
        return user


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'


class ConteneurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conteneur
        fields = '__all__'


class ProduitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produit
        fields = '__all__'


class PaiementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paiement
        fields = '__all__'


class ContratGroupageSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    conteneur = ConteneurSerializer(read_only=True)
    produits = ProduitSerializer(many=True, read_only=True)
    
    class Meta:
        model = ContratGroupage
        fields = '__all__'
