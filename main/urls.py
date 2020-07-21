from django.urls import path
from . import views
urlpatterns = [
	path('',views.index, name='index'),
	path('1/',views.index2, name='index2'),
	path('signup/',views.signup,name='signup'),
	path('login/',views.login,name='login'),
	path('forgotpassword/',views.forgotpassword,name='forgotpassword'),
	path('getchats/', views.get_chats, name='getchats'),
	path('getcontacts/', views.get_contacts, name='getcontacts'),
	path('t/<str:username>/', views.messages, name='messages'),
	path('submitMessage/',views.submitMessage, name='submitMessage'),
	path('form/',views.form, name='form'),
	path('getmessages/',views.getmessages,name='getmessages'),
	path('typing/',views.typing, name='typing'),
	path('delete/',views.delete,name='delete'),
	path('online/',views.online,name='online'),
	path('searchusers/', views.searchusers, name='searchusers'),
	path('addcontact/', views.add_contact, name='addcontact'),
	path('getonlinestatus/', views.get_online_status, name='getonlinestatus'),
]