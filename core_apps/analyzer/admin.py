from django.contrib import admin
from .models import UploadedWorkbook

@admin.register(UploadedWorkbook)
class UploadedWorkbookAdmin(admin.ModelAdmin):
    list_display = ('file_name',)
    list_filter = ('processed',)
    search_fields = ('original_filename',)
