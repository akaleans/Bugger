from django.contrib import admin
from .models import BuggerUser, Project, Ticket, TicketAttachment, TicketComment, TicketEvent


# Register your models here.
admin.site.register(BuggerUser)
admin.site.register(Project)
admin.site.register(Ticket)
admin.site.register(TicketAttachment)
admin.site.register(TicketComment)
admin.site.register(TicketEvent)