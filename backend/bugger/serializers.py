from .models import BuggerUser, Project, Ticket, TicketAttachment, TicketComment, TicketEvent
from rest_framework import serializers


class BuggerUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuggerUser
        fields = ('id', 'first_name', 'last_name', 'email', 'role')


class TicketShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ('id', 'ticket_title', 'assigned_to', 'project_name', 'status', 'date_created', 'description',
        'submitter', 'priority', 'ticket_type', 'ticket_comments', 'ticket_events', 'ticket_attachments')


class ProjectSerializer(serializers.ModelSerializer):
    users = BuggerUserSerializer(read_only=True, many=True)
    tickets = TicketShortSerializer(required=False, read_only=True, many=True)

    class Meta:
        model = Project
        fields = ('id', 'name', 'date_created', 'description', 'users', 'tickets')


class TicketAttachmentSerializer(serializers.ModelSerializer):
    ticket_name = TicketShortSerializer(read_only=True)
    submitter = BuggerUserSerializer(read_only=True)

    class Meta:
        model = TicketAttachment
        fields = ('id', 'submitter', 'file', 'notes', 'date_created', 'ticket_name')


class TicketCommentSerializer(serializers.ModelSerializer):
    ticket_name = TicketShortSerializer(read_only=True)
    submitter = BuggerUserSerializer(read_only=True)

    class Meta:
        model = TicketComment
        fields = ('id', 'submitter', 'message', 'date_created', 'ticket_name')


class TicketEventSerializer(serializers.ModelSerializer):
    ticket_name = TicketShortSerializer(read_only=True)
    submitter = BuggerUserSerializer(read_only=True)

    class Meta:
        model = TicketEvent
        fields = ('id', 'submitter', 'property_changed', 'old_value', 'new_value', 'date_changed', 'ticket_name')
        

class TicketSerializer(serializers.ModelSerializer):
    assigned_to = BuggerUserSerializer(read_only=True)
    project_name = ProjectSerializer(read_only=True)
    submitter = BuggerUserSerializer(read_only=True)
    ticket_comments = TicketCommentSerializer(read_only=True, many=True)
    ticket_events = TicketEventSerializer(read_only=True, many=True)
    ticket_attachments = TicketAttachmentSerializer(read_only=True, many=True)

    class Meta:
        model = Ticket
        fields = ('id', 'ticket_title', 'assigned_to', 'project_name', 'status', 'date_created', 'description',
        'submitter', 'priority', 'ticket_type', 'ticket_comments', 'ticket_events', 'ticket_attachments')