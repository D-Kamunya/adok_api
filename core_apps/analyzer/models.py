from django.db import models
from core_apps.common.models import TimeStampedModel

class UploadedWorkbook(TimeStampedModel):
    """
    Model to track uploaded Excel workbooks for attendance data.
    """
    file = models.FileField(upload_to='uploads/workbooks/')
    file_name = models.CharField(max_length=255)
    sheet_date = models.DateField(help_text="Sunday date parsed from filename or sheet name")
    processed = models.BooleanField(default=False)
    error_message = models.TextField(blank=True)

    class Meta:
        ordering = ['-sheet_date', '-created_at']

    def __str__(self):
        return f"Workbook {self.file.name} ({self.sheet_date})"