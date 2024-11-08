""" Defines admin module"""
from django.contrib import admin
from django.apps import apps

# Get all models inside the App
EgyptianConstitutionApp = apps.get_app_config('egyptian_constitution_app').get_models()

for model in EgyptianConstitutionApp:
    try:
        admin.site.register(model)
    except admin.sites.AlreadyRegistered:
        pass
