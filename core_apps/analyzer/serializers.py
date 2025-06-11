from rest_framework import serializers

class WorkbookUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        name = value.name.lower()
        if not name.endswith('.xlsx'):
            raise serializers.ValidationError("Only .xlsx Excel files are accepted.")
        return value