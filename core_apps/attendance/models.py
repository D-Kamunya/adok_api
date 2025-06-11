from django.db import models
from core_apps.common.models import TimeStampedModel,Archdeaconry,Parish,Congregation
from core_apps.analyzer.models import UploadedWorkbook

class AttendanceRecord(TimeStampedModel):
    """
    Stores weekly attendance and collection data for a Congregation on a given Sunday.
    """
    workbook = models.ForeignKey(
        UploadedWorkbook,
        related_name='attendance_records',
        on_delete=models.CASCADE
    )
    archdeaconry = models.ForeignKey(
        Archdeaconry,
        related_name='attendance_records',
        on_delete=models.PROTECT
    )
    parish = models.ForeignKey(
        Parish,
        related_name='attendance_records',
        on_delete=models.PROTECT
    )
    congregation = models.ForeignKey(
        Congregation,
        related_name='attendance_records',
        on_delete=models.PROTECT
    )
    sunday_date = models.DateField()
    sunday_school = models.PositiveIntegerField(default=0)
    adults = models.PositiveIntegerField(default=0)
    diff_abled = models.PositiveIntegerField(default=0, verbose_name="diff_abled")
    youth = models.PositiveIntegerField(default=0)
    total_collection = models.DecimalField(max_digits=12, decimal_places=2)
    banked = models.DecimalField(max_digits=12, decimal_places=2)
    unbanked = models.DecimalField(max_digits=12, decimal_places=2)
    remarks = models.TextField(blank=True)

    class Meta:
        unique_together = ('congregation', 'sunday_date')
        ordering = ['-sunday_date', 'archdeaconry', 'parish', 'congregation']
        indexes = [
            models.Index(fields=['sunday_date']),
            models.Index(fields=['archdeaconry', 'parish']),
        ]

    def __str__(self):
        return f"{self.congregation.name} @ {self.sunday_date}"
