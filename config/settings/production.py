from os import getenv, path
from dotenv import load_dotenv
from .base import *  # noqa
from .base import BASE_DIR


django_env = path.join(BASE_DIR, ".envs", ".production", ".django")
postgres_env = path.join(BASE_DIR, ".envs", ".production", ".postgres")

# Load both
if path.isfile(django_env):
    load_dotenv(dotenv_path=django_env)

if path.isfile(postgres_env):
    load_dotenv(dotenv_path=postgres_env)

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

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

SECURE_SSL_REDIRECT = getenv("SECURE_SSL_REDIRECT")

SESSION_COOKIE_SECURE = True

CSRF_COOKIE_SECURE = True

SECURE_HSTS_SECONDS = 300

SECURE_HSTS_INCLUDE_SUBDOMAINS = getenv("SECURE_HSTS_INCLUDE_SUBDOMAINS")

SECURE_HSTS_PRELOAD = getenv("SECURE_HSTS_PRELOAD")

SECURE_CONTENT_TYPE_NOSNIFF = getenv("SECURE_CONTENT_TYPE_NOSNIFF")
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
