from django.db import models


class BuggerUser(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=30, blank=True)

    def __str__(self):
        return self.first_name + ' ' + self.last_name


class Project(models.Model):
    name = models.CharField(max_length=120)
    date_created = models.DateTimeField()
    description = models.TextField(blank=True)
    users = models.ManyToManyField(BuggerUser, blank=True)
    tickets = models.ManyToManyField('Ticket', blank=True)

    def __str__(self):
        return self.name


class TicketComment(models.Model):
    submitter = models.ForeignKey(BuggerUser, on_delete=models.PROTECT)
    message = models.TextField()
    date_created = models.DateTimeField()
    ticket_name = models.ForeignKey('Ticket', on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.message


class TicketEvent(models.Model):
    submitter = models.ForeignKey(BuggerUser, on_delete=models.PROTECT)
    property_changed = models.CharField(max_length=30)
    old_value = models.CharField(max_length=30)
    new_value = models.CharField(max_length=30)
    date_changed = models.DateTimeField()
    ticket_name = models.ForeignKey('Ticket', on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.property_changed


class TicketAttachment(models.Model):
    submitter = models.ForeignKey(BuggerUser, on_delete=models.PROTECT)
    file = models.FileField()
    notes = models.TextField(blank=True)
    date_created = models.DateTimeField()
    ticket_name = models.ForeignKey('Ticket', on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.notes


class Ticket(models.Model):
    ticket_title = models.CharField(max_length=120)
    assigned_to = models.ForeignKey(BuggerUser, blank=True, null=True, on_delete=models.PROTECT, related_name='+')
    project_name = models.ForeignKey(Project, on_delete=models.PROTECT)
    status = models.CharField(max_length=10)
    date_created = models.DateTimeField()
    description = models.TextField()
    submitter = models.ForeignKey(BuggerUser, on_delete=models.PROTECT, related_name='+')
    priority = models.CharField(max_length=10)
    ticket_type = models.CharField(max_length=30)
    ticket_comments = models.ManyToManyField(TicketComment, blank=True)
    ticket_events = models.ManyToManyField(TicketEvent, blank=True)
    ticket_attachments = models.ManyToManyField(TicketAttachment, blank=True)

    def __str__(self):
        return self.ticket_title