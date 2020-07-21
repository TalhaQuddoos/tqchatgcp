from django.db import models

class User(models.Model):
	username = models.CharField(max_length=50)
	email = models.CharField(max_length=50)
	password = models.CharField(max_length=50)
	firstname = models.CharField(max_length=50)
	lastname = models.CharField(max_length=50)
	name = models.CharField(max_length=50)
	photo = models.FileField(upload_to='users')
	lastactive = models.IntegerField(default=0)

class Message(models.Model):
	sender = models.CharField(max_length=50)
	receiver = models.CharField(max_length=50)
	msg = models.TextField()
	time = models.DateTimeField(auto_now_add=True)
	seen = models.BooleanField()
	deleted = models.IntegerField(default=0)
	lastactive = models.IntegerField(default=0)
	def __str__(self):
		return str(self.id) + '  '+self.sender + ' > ' + self.receiver + ' => ' + self.msg

class Contact(models.Model):
	u1 = models.CharField(max_length=50)
	u2 = models.CharField(max_length=50)



