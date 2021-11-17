from django.urls import path
from .views import AddUserToProject, CreateComment, CreateProject, CreateTicket, CreateUser, DeleteProject, DeleteUser, GetProject, GetProjects, GetTicket, GetTicketAttachments, GetTicketComments, GetTickets, GetUser, GetUserProjects, GetUsers, RemoveUserFromProject, UpdateProject, UpdateTicket, UpdateUser

urlpatterns = [
    path('get-projects', GetProjects.as_view()),
    path('get-project/<id>', GetProject.as_view()),
    path('update-project/<id>', UpdateProject.as_view()),
    path('add-user-to-project/<id>', AddUserToProject.as_view()),
    path('remove-user-from-project/<id>', RemoveUserFromProject.as_view()),
    path('get-user-projects/<id>', GetUserProjects.as_view()),
    path('create-project', CreateProject.as_view()),
    path('delete-project/<id>', DeleteProject.as_view()),
    
    path('get-users', GetUsers.as_view()),
    path('get-user/<id>', GetUser.as_view()),
    path('delete-user/<id>', DeleteUser.as_view()),
    path('update-user/<id>', UpdateUser.as_view()),
    path('create-user', CreateUser.as_view()),
    
    path('get-tickets', GetTickets.as_view()),
    path('get-ticket/<id>', GetTicket.as_view()),
    path('get-ticket-comments/<id>', GetTicketComments.as_view()),
    path('get-ticket-attachments/<id>', GetTicketAttachments.as_view()),
    path('update-ticket/<id>', UpdateTicket.as_view()),
    path('create-ticket', CreateTicket.as_view()),
    
    path('create-comment', CreateComment.as_view()),
]