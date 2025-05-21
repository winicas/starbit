from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ClientViewSet,
    ConteneurViewSet,
    ContratGroupageViewSet,
    ProduitViewSet,
    PaiementViewSet,
    LoginAPIView,
    LogoutView,
    ChangePasswordView,
    UserProfileUpdateView,
    UserProfileView,
    CreateDirecteurAPIView,
    AdminDashboardAPIView,
)

router = DefaultRouter()
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'conteneurs', ConteneurViewSet)
router.register(r'contrats', ContratGroupageViewSet)
router.register(r'produits', ProduitViewSet)
router.register(r'paiements', PaiementViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Toutes les routes de ViewSet
    
    # Routes personnalisées
    path('login/', LoginAPIView.as_view(), name='api-login'),
    path('create-directeur/', CreateDirecteurAPIView.as_view(), name='create-directeur'),
    path('me/', UserProfileView.as_view(), name='user-profile'),
    path("me/update/", UserProfileUpdateView.as_view(), name="update-profile"),
    path("me/change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path('admin-dashboard/', AdminDashboardAPIView.as_view(), name='admin-dashboard'),
]
