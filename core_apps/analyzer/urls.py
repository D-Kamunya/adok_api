from django.urls import path
from .views import WorkbookUploadView

urlpatterns = [
    path('upload-workbook/', WorkbookUploadView.as_view(), name='upload-workbook'),
]