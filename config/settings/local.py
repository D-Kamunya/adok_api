from .base import * #noqa

SECRET_KEY = getenv("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = getenv("DEBUG")

SITE_NAME = getenv("SITE_NAME")

ADMINS = [("D-Kamunya", "kinc.developer@gmail.com")]

ALLOWED_HOSTS = getenv("ALLOWED_HOSTS").split(" ")

ADMIN_URL = getenv("ADMIN_URL")

DOMAIN = getenv("DOMAIN")

CSRF_TRUSTED_ORIGINS = getenv("CSRF_TRUSTED_ORIGINS").split(" ")

# Configure CORS settings
CORS_ALLOWED_ORIGINS = getenv("CORS_ALLOWED_ORIGINS").split(" ")

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": getenv("POSTGRES_ENGINE"),
        "NAME": getenv("POSTGRES_DB"),
        "USER": getenv("POSTGRES_USER"),
        "PASSWORD": getenv("POSTGRES_PASSWORD"),
        "HOST": getenv("POSTGRES_HOST"),
        "PORT": getenv("POSTGRES_PORT"),
    }
}
