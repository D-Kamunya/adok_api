from django.urls import path
from .views import WorkbookUploadView,DashboardAnalytics,ArchdeaconryListView,CongregationListView,ParishListView,CongregationsByArchdeaconryView,RecordsListView

urlpatterns = [
    path('upload-workbook/', WorkbookUploadView.as_view(), name='upload-workbook'),
    path('dashboard/', DashboardAnalytics.as_view(), name='dashboard-analytics'),
    path('archdeaconries/', ArchdeaconryListView.as_view()),
    path('parishes/', ParishListView.as_view()),
    path('records/', RecordsListView.as_view()),
    path('congregations/', CongregationListView.as_view()),
    path('congregations/by_archdeaconry/', CongregationsByArchdeaconryView.as_view()),
]
