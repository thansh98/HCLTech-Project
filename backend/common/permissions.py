from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """Allows access only to users with role 'admin' or superusers."""
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and (
                request.user.role == 'admin' or request.user.is_superuser
            )
        )

class IsManagerOrAdmin(permissions.BasePermission):
    """Allows access to users with role 'admin', 'manager', or superusers."""
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and (
                request.user.role in ['admin', 'manager'] or request.user.is_superuser
            )
        )

class IsViewerOrHigher(permissions.BasePermission):
    """Allows read/access to any authenticated user."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

class ReadOnlyOrManagerAdmin(permissions.BasePermission):
    """SAFE_METHODS allowed for authenticated viewers; modifications require Manager/Admin."""
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.role in ['admin', 'manager'] or request.user.is_superuser
