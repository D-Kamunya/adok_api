from rest_framework import serializers

class WorkbookUploadSerializer(serializers.Serializer):
    files = serializers.ListField(
        child=serializers.FileField(allow_empty_file=False),
        allow_empty=False
    )

    def validate_file(self, value):
        name = value.name.lower()
        if not name.endswith('.xlsx'):
            raise serializers.ValidationError("Only .xlsx Excel files are accepted.")
        return value