from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.db.models import Q
from .models import User, Message, Contact
import time
# Create your views here.
def index(request):
	if request.COOKIES.get('id'):
		user = User.objects.get(id=request.COOKIES.get('id'))
		photo = user.photo.name
		firstname = user.firstname
		lastname = user.lastname
		context = {'firstname':firstname,'lastname':lastname,'photo':photo}
		return render(request,'index3.html', context)
	else:
		return HttpResponseRedirect('/login')
		

def index2(request):
	return render(request,'index2.html')

def addmessage(request):
	user = User.object.filter(id=request.COOKIES.get('id')).first().username
def signup(request):
	if request.COOKIES.get('id'):
		return HttpResponseRedirect('/')
	if request.method == 'POST':
		username = request.POST.get('username')
		email = request.POST.get('email')
		firstname = request.POST.get('firstname')
		lastname = request.POST.get('lastname')
		name = firstname + ' ' + lastname
		password = request.POST.get('password')
		photo = request.FILES
		photo = photo['photo']
		user = User(username=username, password=password,email=email, firstname=firstname, lastname=lastname, photo=photo, name=name)
		user.save()
		return HttpResponseRedirect('/login')
	return render(request,'signup.html')

def login(request):
	if request.COOKIES.get('id'):
		return HttpResponseRedirect('/')
	if request.method == 'POST':
		usernameoremail = request.POST.get('usernameoremail')
		password = request.POST.get('password')
		user = User.objects.filter(Q(username=usernameoremail)|Q(email=usernameoremail), password=password).first()
		if user is not None:
			response = HttpResponseRedirect('/')
			response.set_cookie('id',user.id)
			return response
	return render(request,'login.html')

def forgotpassword(request):
	return render(request,'forgotpassword.html')


def get_chats(request):
	users = User.objects.all().exclude(id=request.COOKIES["id"])
	username = User.objects.filter(id=request.COOKIES.get('id')).first().username
	res = []
	for user in users:
		msg = Message.objects.filter(Q(sender=user.username)|Q(receiver=user.username), Q(sender=username)|Q(receiver=username)).last()
		if msg:
			lmby = 0
			if msg.sender == username:
				lmby = 1
			res.append({'firstname':user.firstname, 'lastname':user.lastname, 'photo':user.photo.name, 'username':user.username,'lastactive':user.lastactive,'timenow':int(time.time()), 'lastmsg':msg.msg, 'lmby':lmby,'time':msg.time})
	if len(res) > 0:
		return JsonResponse(res,safe=False)
	else:
		return HttpResponse('')

def get_contacts(request):
	contacts = Contact.objects.filter(u1=User.objects.filter(id=request.COOKIES.get('id')).first().username)
	res = []
	for contact in contacts:		
		user = User.objects.filter(username=contact.u2).first()
		if user:
			res.append({'username':user.username, 'name':user.name, 'photo':user.photo.name, 'lastactive':user.lastactive,'timenow':int(time.time())})
	return JsonResponse(res, safe=False)

def getmessages(request):
	username = User.objects.filter(id=request.COOKIES.get('id')).first().username
	user = User.objects.filter(id=request.POST.get('user')).first().username
	messages = Message.objects.filter(Q(sender=user)|Q(receiver=user), Q(sender=username)|Q(receiver=username), id__gt=request.POST.get('lmi'))
	res = []
	deletedmsgs = []
	for msg in Message.objects.filter(Q(sender=user)|Q(receiver=user), Q(sender=username)|Q(receiver=username)):
		if msg.deleted == 4:
			deletedmsgs.append(msg.id)
			if msg.receiver == username:
				msg.delete()
	for msg in messages:
		s = 0
		if msg.sender==username:
			s = 1
			if msg.deleted == 1:
				continue
		else:
			if msg.deleted == 2:
				continue
		res.append({'s':s, 'msg': msg.msg, 'id':msg.id, 'time':msg.time})
	if len(res) > 0:
		res = [{'lmi': res[len(res)-1]['id'], "deletedmsgs":deletedmsgs}]+res;
	elif len(deletedmsgs) > 0:
		res = [{'deletedmsgs':deletedmsgs, 'lmi':0}]
	
	#if(len(res)>0):
	#return HttpResponse(res)		
	return JsonResponse(res,safe=False)

def messages(request, username):
	rec = User.objects.filter(username=username).first()
	photo = User.objects.filter(id=request.COOKIES.get('id')).first().photo.name
	return render(request, 'index3.html', {'receiver':rec.id, 'receiverphoto':rec.photo, 'receivername':rec.firstname+' '+rec.lastname , "photo":photo})
def submitMessage(request):
	msg = request.POST.get('message')
	receiver = User.objects.filter(id=request.POST.get('to')).first().username
	msgs = Message.objects.filter(sender=User.objects.filter(id=request.COOKIES.get('id')).first().username, receiver=receiver, msg='__t__')
	for abc in msgs:
		abc.delete()
	message = Message(msg=msg, receiver=receiver, sender=User.objects.filter(id=request.COOKIES.get('id')).first().username,seen=False)
	message.save()
	return HttpResponse('')
def form(request):
	#return HttpResponse(request.POST.get('message'))
	return render(request, 'form.html')
def typing(request):
	user = User.objects.filter(id=request.POST.get('to')).first().username
	# retu#rn HttpResponse(type(request.POST['remove']))
	username = User.objects.filter(id=request.COOKIES.get('id')).first().username
	abc = Message.objects.filter(sender=username, receiver=user, msg='__t__')
	if int(request.POST['remove']) == 1:
		for xyz in Message.objects.filter(sender=username, receiver=user, msg='__t__'):
			xyz.delete()
		return HttpResponse('')
	else:

		msg = Message(sender=username, receiver=user, msg='__t__', seen=False)
		msg.save()
		return HttpResponse('')

def delete(request):
	ID = request.POST.get('id')
	msg = Message.objects.filter(id=ID).first()
	del4 = request.POST.get('for')
	if del4 == 'everyone':
		msg.deleted = 4
		msg.save()
	elif del4 == 'me':
		if msg.sender == User.objects.filter(id=request.COOKIES.get('id')).first().username:
			if msg.deleted == 2:
				msg.delete()
			else:
				msg.deleted = 1
				msg.save()
		else:
			if msg.deleted == 1:
				msg.delete()
			else:
				msg.deleted = 2
				msg.save()
	return HttpResponse('')



def online(request):
	user = User.objects.filter(id=request.COOKIES.get('id')).first()
	user.lastactive = int(time.time())
	user.save()
	return HttpResponse('')


def delTyping(receiver):
	for msg in Message.objects.filter(msg='__t__', sender=User.objects.filter(id=request.COOKIES.get('id')).first().username, receiver=receiver):
		msg.delete()


def searchusers(request):
	search = request.POST.get('search')
	users = User.objects.filter(Q(firstname__icontains=search)|Q(lastname__icontains=search)|Q(username__icontains=search)|Q(firstname=search)|Q(lastname=search)|Q(username=search)|Q(name__icontains=search)|Q(name=search))
	contacts = Contact.objects.filter(u1=User.objects.get(id=request.COOKIES['id']).username)

	res = []
	for user in users:	
		contact = Contact.objects.filter(u2=user.username).first()
		if contact is None:
			res.append({'name':user.firstname+' '+user.lastname, 'username':user.username, 'photo':user.photo.name})
		else:
			continue
	return JsonResponse(res, safe=False)


def add_contact(request):
	contact = Contact(u2=request.POST.get('username'), u1=User.objects.get(id=request.COOKIES.get('id')).username)
	contact.save()
	return HttpResponse(' ')

def get_online_status(request):
	timenow = int(time.time())
	lastonline = User.objects.filter(id=request.POST.get('receiver')).first().lastactive
	return HttpResponse(timenow-lastonline)