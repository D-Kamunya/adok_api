from django.db import models

class TimeStampedModel(models.Model):
    """
    Abstract base class that provides self-updating ``created_at`` and ``updated_at`` fields.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Archdeaconry(TimeStampedModel):
    """
    Represents an archedeaconry within the diocese
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Parish(TimeStampedModel):
    """
    Represents a parish under an Archdeaconry
    """
    archdeaconry = models.ForeignKey(Archdeaconry, on_delete=models.CASCADE, related_name='parishes')
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, blank=True, help_text="Short code for reporting")
    description = models.TextField(blank=True)

    class Meta:
        unique_together = ( 'archdeaconry','name')
        ordering = ['archdeaconry', 'name']

    def __str__(self):
        return f"{self.archdeaconry.name}/{self.name}"


class Congregation(TimeStampedModel):
    """
    Represents a local church/congregation under a Parish.
    """
    parish = models.ForeignKey(
        Parish,
        related_name='congregations',
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, blank=True, help_text="Short code for reporting")
    address = models.CharField(max_length=255, blank=True)
    active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('parish', 'name')
        ordering = ['parish', 'name']

    def __str__(self):
        return f"{self.parish.archdeaconry.name} / {self.parish.name} / {self.name}"