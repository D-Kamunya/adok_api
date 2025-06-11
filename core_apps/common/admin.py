from django.contrib import admin
from .models import Archdeaconry,Parish,Congregation

# Register your models here.
@admin.register(Archdeaconry)
class ArchdeaconryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Parish)
class ParishAdmin(admin.ModelAdmin):
    list_display = ('name', 'archdeaconry')
    list_filter = ('archdeaconry',)
    search_fields = ('name',)

@admin.register(Congregation)
class CongregationAdmin(admin.ModelAdmin):
    list_display = ('name', 'parish')
    list_filter = ('parish',)
    search_fields = ('name',)