from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class AnalyzerConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core_apps.analyzer"
    verbose_name = _("Data Analyzer" )
