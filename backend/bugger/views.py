from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from django.db.models import query
from rest_framework import generics, status
from rest_framework.serializers import Serializer
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import BuggerUserSerializer, ProjectSerializer, TicketSerializer, TicketEventSerializer, TicketAttachmentSerializer, TicketCommentSerializer
from .models import BuggerUser, Project, Ticket, TicketAttachment, TicketComment, TicketEvent


class ProjectView(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class GetProjects(APIView):

    def get(self, request, format=None):
        data = ProjectSerializer(Project.objects.all(), many=True).data
        if len(data) > 0:
            return Response(data, status=status.HTTP_200_OK)
        return Response({'Projects Not Found': 'No Projects Found'}, status=status.HTTP_404_NOT_FOUND)
    
class GetTickets(APIView):

    def get(self, request, format=None):
        data = TicketSerializer(Ticket.objects.all(), many=True).data
        if len(data) > 0:
            return Response(data, status=status.HTTP_200_OK)
        return Response({'Tickets Not Found': 'No Tickets Found'}, status=status.HTTP_404_NOT_FOUND)
    
class AddUserToProject(APIView):
    
    def put(self, request, id, format=None):
        if id != None:
            project = Project.objects.get(id=id)
            if project != None:
                userID = request.data.get('id')
                user = BuggerUser.objects.get(id=userID)
                if user != None:
                    project.users.add(user)
                return Response({'message': 'Update was successful'}, status=status.HTTP_202_ACCEPTED)
            return Response({'message': 'Project ID not in database'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'No ID in request'}, status=status.HTTP_400_BAD_REQUEST)
    
class RemoveUserFromProject(APIView):
    
    def delete(self, request, id, format=None):
        if id != None:
            project = Project.objects.get(id=id)
            if project != None:
                userID = request.data.get('id')
                user = BuggerUser.objects.get(id=userID)
                if user != None:
                    project.users.remove(user)
                return Response({'message': 'Update was successful'}, status=status.HTTP_202_ACCEPTED)
            return Response({'message': 'Project ID not in database'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'No ID in request'}, status=status.HTTP_400_BAD_REQUEST)
    
class GetProject(APIView):
    serializer_class = ProjectSerializer

    def get(self, request, id, format=None):
        if id != None:
            project = Project.objects.get(id=id)
            if project != None:
                serializer = self.serializer_class(project)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({'message': 'Project ID not in database'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'No ID in request'}, status=status.HTTP_400_BAD_REQUEST)
    
class GetTicket(APIView):
    serializer_class = TicketSerializer

    def get(self, request, id, format=None):
        if id != None:
            ticket = Ticket.objects.get(id=id)
            if ticket != None:
                serializer = self.serializer_class(ticket)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({'message': 'Ticket ID not in database'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'No ID in request'}, status=status.HTTP_400_BAD_REQUEST)
    
class GetUser(APIView):
    serializer_class = BuggerUserSerializer

    def get(self, request, id, format=None):
        if id != None:
            user = BuggerUser.objects.get(id=id)
            if user != None:
                serializer = self.serializer_class(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({'message': 'User ID not in database'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'No ID in request'}, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateProject(APIView):
    serializer_class = ProjectSerializer
    
    def put(self, request, id, format=None):
        if id != None:
            project = Project.objects.get(id=id)
            if project != None:
                serializer = self.serializer_class(project, data=request.data)
                if serializer.is_valid():
                    serializer.save()
                return Response({'message': 'Update was successful'}, status=status.HTTP_202_ACCEPTED)
            return Response({'message': 'Project ID not in database'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'No ID in request'}, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateTicket(APIView):
    
    def put(self, request, id, format=None):
        if id != None:
            ticket = Ticket.objects.get(id=id)
            if ticket != None:
                serializer = TicketSerializer(ticket, data=request.data)
                if serializer.is_valid():
                    serializer.save()
                return Response({'message': 'Update was successful'}, status=status.HTTP_202_ACCEPTED)
            return Response({'message': 'Project ID not in database'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'No ID in request'}, status=status.HTTP_400_BAD_REQUEST)

class GetUserProjects(APIView):

    def get(self, request, id, format=None):
        if id != None:
            data = ProjectSerializer(Project.objects.filter(users__id=id), many=True).data
            if len(data) > 0:
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Projects Not Found': 'No Projects Assigned to User'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'ID Not Found in Request'}, status=status.HTTP_400_BAD_REQUEST)
    
class GetUserTickets(APIView):

    def get(self, request, id, format=None):
        if id != None:
            data = TicketSerializer(Ticket.objects.filter(assigned_to__id=id), many=True).data
            if len(data) > 0:
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Projects Not Found': 'No Projects Assigned to User'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'ID Not Found in Request'}, status=status.HTTP_400_BAD_REQUEST)
    
class GetTicketComments(APIView):

    def get(self, request, id, format=None):
        if id != None:
            data = TicketCommentSerializer(TicketComment.objects.filter(ticket_name__id=id), many=True).data
            if len(data) > 0:
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Comments Not Found': 'No Ticket Comments Assigned to Ticket'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Ticket ID Not Found in Request'}, status=status.HTTP_400_BAD_REQUEST)

class GetTicketAttachments(APIView):

    def get(self, request, id, format=None):
        if id != None:
            data = TicketAttachmentSerializer(TicketAttachment.objects.filter(ticket_name__id=id), many=True).data
            if len(data) > 0:
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Comments Not Found': 'No Ticket Comments Assigned to Ticket'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Ticket ID Not Found in Request'}, status=status.HTTP_400_BAD_REQUEST)

class GetUsers(APIView):
    serializer_class = BuggerUserSerializer

    def get(self, request, format=None):
        data = BuggerUserSerializer(BuggerUser.objects.all(), many=True).data
        if len(data) > 0:
            return Response(data, status=status.HTTP_200_OK)
        return Response({'Users Not Found': 'No Users in Database'}, status=status.HTTP_404_NOT_FOUND)

class DeleteUser(APIView):

    def delete(self, request, id, format=None):
        id = id
        if id != None:
            user = BuggerUser.objects.get(id=id)
            if user != None:
                user.delete()
                return Response({'message': 'Delete was successful'}, status=status.HTTP_202_ACCEPTED)
            return Response({'message': 'User ID not in database'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'No ID in request'}, status=status.HTTP_400_BAD_REQUEST)
    
class DeleteTicket(APIView):

    def delete(self, request, id, format=None):
        id = id
        if id != None:
            obj = Ticket.objects.get(id=id)
            if obj != None:
                obj.delete()
                return Response({'message': 'Delete was successful'}, status=status.HTTP_202_ACCEPTED)
            return Response({'message': 'User ID not in database'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'No ID in request'}, status=status.HTTP_400_BAD_REQUEST)
    
class DeleteProject(APIView):

    def delete(self, request, id, format=None):
        id = id
        if id != None:
            project = Project.objects.get(id=id)
            if project != None:
                project.delete()
                return Response({'message': 'Delete was successful'}, status=status.HTTP_202_ACCEPTED)
            return Response({'message': 'Project ID not in database'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'No ID in request'}, status=status.HTTP_400_BAD_REQUEST)

class CreateUser(APIView):
    serializer_class = BuggerUserSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            first_name = serializer.data.get('first_name')
            last_name = serializer.data.get('last_name')
            role = serializer.data.get('role')
            email = serializer.data.get('email')
            user = BuggerUser(first_name=first_name, last_name=last_name, role=role, email=email)
            user.save()
            return Response(BuggerUserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response({'message': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
    
class CreateProject(APIView):

    def post(self, request, format=None):
        serializer = ProjectSerializer(data=request.data)
        print(serializer)
        if serializer.is_valid():
            name = serializer.data.get('name')
            description = serializer.data.get('description')
            date_created = serializer.data.get('date_created')
            project = Project(name=name, description=description, date_created=date_created)
            project.save()
            return Response(ProjectSerializer(project).data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response({'message': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class CreateComment(APIView):
    
    def post(self, request, format=None):
        serializer = TicketCommentSerializer(data=request.data)
        submitter_name_id = request.data.get('submitter')
        ticket_name_id = request.data.get('ticket_name')
        if serializer.is_valid():
            submitter = BuggerUser.objects.get(id=submitter_name_id)
            message = serializer.data.get('message')
            date_created = serializer.data.get('date_created')
            ticket_name = Ticket.objects.get(id=ticket_name_id)
            ticket_comment = TicketComment(submitter=submitter, message=message, date_created=date_created, ticket_name=ticket_name)
            ticket_comment.save()
            ticket_name.ticket_comments.add(ticket_comment)
            return Response(TicketCommentSerializer(ticket_comment).data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
        return Response({'message': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class CreateTicket(APIView):

    def post(self, request, format=None):
        serializer = TicketSerializer(data=request.data)
        assigned_to_id = request.data.get('assigned_to')
        project_name_id = request.data.get('project_name')
        submitter_id = request.data.get('submitter')
        if serializer.is_valid():
            ticket_title = serializer.data.get('ticket_title')
            assigned_to = BuggerUser.objects.get(id=assigned_to_id)
            project_name = Project.objects.get(id=project_name_id)
            ticket_status = serializer.data.get('status')
            date_created = serializer.data.get('date_created')
            description = serializer.data.get('description')
            submitter = BuggerUser.objects.get(id=submitter_id)
            priority = serializer.data.get('priority')
            ticket_type = serializer.data.get('ticket_type')
            ticket = Ticket(ticket_title=ticket_title,
                            assigned_to=assigned_to,
                            project_name=project_name,
                            status=ticket_status,
                            date_created=date_created,
                            description=description,
                            submitter=submitter,
                            priority=priority,
                            ticket_type=ticket_type)
            ticket.save()
            project_name.tickets.add(ticket)
            return Response(TicketSerializer(ticket).data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
        return Response({'message': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class UpdateUser(APIView):
    serializer_class = BuggerUserSerializer

    def put(self, request, id, format=None):
        if id != None:
            user = BuggerUser.objects.get(id=id)
            if user != None:
                serializer = self.serializer_class(user, data=request.data)
                if serializer.is_valid():
                    serializer.save()
                return Response({'message': 'Update was successful'}, status=status.HTTP_202_ACCEPTED)
            return Response({'message': 'User ID not in database'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'No ID in request'}, status=status.HTTP_400_BAD_REQUEST)

