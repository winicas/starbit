from django.contrib import admin
from .models import Client, Conteneur, ContratGroupage, Produit, Paiement

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('nom', 'telephone')

@admin.register(Conteneur)
class ConteneurAdmin(admin.ModelAdmin):
    list_display = ('numero', 'port_origine', 'destination', 'date_chargement')

@admin.register(ContratGroupage)
class ContratGroupageAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'conteneur', 'date_contrat')

@admin.register(Produit)
class ProduitAdmin(admin.ModelAdmin):
    list_display = ('designation', 'contrat', 'quantite', 'volume_cbm', 'montant_usd')

@admin.register(Paiement)
class PaiementAdmin(admin.ModelAdmin):
    list_display = ('contrat', 'montant', 'date', 'methode', 'statut')
