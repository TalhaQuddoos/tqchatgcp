from django.contrib import admin
from .models import User, Message, Contact

admin.site.register(User)
admin.site.register(Message)
admin.site.register(Contact)
