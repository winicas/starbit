from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone


 
    
class CustomUserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('The Username field must be set')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'superuser')
        return self.create_user(username, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=150, unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    role = models.CharField(max_length=50, choices=[('superuser', 'Superuser'),('admin', 'Admin'), ('directeur', 'Directeur'), ('comptable', 'Comptable')], default='comptable')
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username
class Client(models.Model):
    nom = models.CharField(max_length=255)
    telephone = models.CharField(max_length=20)

    def __str__(self):
        return self.nom


class Conteneur(models.Model):
    numero = models.CharField(max_length=50)
    port_origine = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    date_chargement = models.DateField()

    def __str__(self):
        return self.numero


class ContratGroupage(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    conteneur = models.ForeignKey(Conteneur, on_delete=models.CASCADE)
    date_contrat = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Contrat {self.id} - {self.client.nom}"


class Produit(models.Model):
    contrat = models.ForeignKey(ContratGroupage, related_name='produits', on_delete=models.CASCADE)
    designation = models.CharField(max_length=255)
    quantite = models.PositiveIntegerField()
    unite = models.CharField(max_length=20, default='Pcs')
    volume_cbm = models.FloatField()
    montant_usd = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.designation


class Paiement(models.Model):
    contrat = models.ForeignKey(ContratGroupage, on_delete=models.CASCADE)
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(auto_now_add=True)
    methode = models.CharField(max_length=50, default='Espèces')
    statut = models.CharField(max_length=20, choices=[
        ('payé', 'Payé'),
        ('en_attente', 'En attente')
    ], default='en_attente')

    def __str__(self):
        return f"{self.contrat} - {self.montant} USD"
