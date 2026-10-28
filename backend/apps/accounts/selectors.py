from django.contrib.auth import get_user_model

User = get_user_model()

def list_users(role=None):
    """Retrieve all users, optionally filtered by role."""
    qs = User.objects.all().order_by('-date_joined')
    if role:
        qs = qs.filter(role=role)
    return qs

def get_user_by_id(user_id):
    """Retrieve a single user by ID."""
    return User.objects.filter(id=user_id).first()
