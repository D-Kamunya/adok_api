from django.contrib import admin
from .models import AttendanceRecord

@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = (
        'congregation', 'sunday_date',
        'sunday_school', 'adults', 'youth', 'diff_abled',
        'total_collection', 'banked', 'unbanked'
    )
    list_filter = ('sunday_date', 'congregation__parish__archdeaconry')
    search_fields = ('congregation__name', 'congregation__parish__name')
    date_hierarchy = 'sunday_date'
