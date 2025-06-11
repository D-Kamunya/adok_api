import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import openpyxl
from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import WorkbookUploadSerializer
from .models import UploadedWorkbook
from core_apps.common.models import Archdeaconry, Parish, Congregation
from core_apps.attendance.models import AttendanceRecord


class WorkbookUploadView(APIView):
    """
    Upload an Excel workbook (.xlsx). If the file name already exists, update its content
    and reprocess. Updates/creates Attendance records.
    """

    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        serializer = WorkbookUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        file = serializer.validated_data['file']
        file_name = file.name

        # Check if workbook already exists by file name
        upload, created = UploadedWorkbook.objects.get_or_create(
            file_name=file_name,
            defaults={'file': file}
        )

        if not created:
            # If same file name already exists, update file and clear old metadata
            upload.file = file
            upload.processed = False
            upload.save()

        # Load workbook
        wb = openpyxl.load_workbook(file)
        total = 0
        errors = []

        for sheet_name in wb.sheetnames:
            try:
                sheet_date = datetime.datetime.strptime(sheet_name, '%d-%m-%y').date()
            except ValueError:
                errors.append(f"Invalid sheet name format: '{sheet_name}'")
                continue

            ws = wb[sheet_name]
            for idx, row in enumerate(ws.iter_rows(min_row=2), start=2):
                arch_name = (row[0].value or '').strip()
                parish_name = (row[1].value or '').strip()
                cong_name = (row[2].value or '').strip()
                if not (arch_name and parish_name and cong_name):
                    continue

                # numeric fallback
                ss = row[3].value or 0
                youth = row[4].value or 0
                adults = row[5].value or 0
                diff_abled = row[6].value or 0
                total_col = row[8].value or 0
                banked = row[9].value or 0
                unbanked = row[10].value or 0
                remarks = row[11].value or ''

                # get/create hierarchy
                arch, _ = Archdeaconry.objects.get_or_create(name=arch_name)
                parish, _ = Parish.objects.get_or_create(name=parish_name, archdeaconry=arch)
                cong, _ = Congregation.objects.get_or_create(name=cong_name, parish=parish)

                # update or create attendance
                AttendanceRecord.objects.update_or_create(
                    workbook=upload,
                    archdeaconry=arch,
                    parish=parish,
                    congregation=cong,
                    sunday_date=sheet_date,
                    defaults={
                        'sunday_school': ss,
                        'adults': adults,
                        'diff_abled': diff_abled,
                        'youth': youth,
                        'total_collection': total_col,
                        'banked': banked,
                        'unbanked': unbanked,
                        'remarks': remarks,
                    }
                )

        upload.sheet_date = sheet_date
        upload.processed = True
        upload.save()

        return Response({
            'status': 'processed',
            'new_upload': created,
            'errors': errors,
        }, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)
