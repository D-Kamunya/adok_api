from os import getenv,path
from dotenv import load_dotenv
from .base import * #noqa
from .base import BASE_DIR

local_env_file = path.join(BASE_DIR,".envs",".env.local")

if path.isfile(local_env_file):
    load_dotenv(local_env_file)

SECRET_KEY = getenv("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = getenv("DEBUG")

SITE_NAME = getenv("SITE_NAME")

ALLOWED_HOSTS = getenv("ALLOWED_HOSTS").split(" ")

ADMIN_URL = getenv("ADMIN_URL")

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": getenv("POSTGRES_ENGINE"),
        "NAME": getenv("POSTGRES_DB"),
        "USER": getenv("POSTGRES_USER"),
        "PASSWORD": getenv("POSTGRES_PASSWORD"),
        "HOST": getenv("PG_HOST"),
        "PORT": getenv("PG_PORT"),
    }
}
