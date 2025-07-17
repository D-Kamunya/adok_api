from rest_framework import serializers
from .models import Archdeaconry, Parish, Congregation, AttendanceRecord

class ArchdeaconrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Archdeaconry
        fields = '__all__'

class ParishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parish
        fields = '__all__'

class CongregationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Congregation
        fields = '__all__'