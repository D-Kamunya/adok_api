# Generated by Django 5.2.2 on 2025-06-11 10:20

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="UploadedWorkbook",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("file", models.FileField(upload_to="uploads/workbooks/")),
                ("file_name", models.CharField(max_length=255)),
                (
                    "sheet_date",
                    models.DateField(
                        help_text="Sunday date parsed from filename or sheet name"
                    ),
                ),
                ("processed", models.BooleanField(default=False)),
                ("error_message", models.TextField(blank=True)),
            ],
            options={
                "ordering": ["-sheet_date", "-created_at"],
            },
        ),
    ]
