from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    """
    Standardized DRF exception handler.
    Returns:
    {
        "status_code": 400,
        "error": {
            "type": "ValidationError",
            "message": "...",
            "details": {...}
        }
    }
    """
    response = exception_handler(exc, context)

    if response is not None:
        error_type = exc.__class__.__name__
        details = response.data

        # Determine a human-readable high-level message
        if isinstance(details, dict):
            if 'message' in details:
                message = str(details['message'])
            elif 'detail' in details:
                message = str(details['detail'])
            else:
                first_key = next(iter(details))
                first_val = details[first_key]
                if isinstance(first_val, list) and len(first_val) > 0:
                    message = f"{first_key}: {first_val[0]}"
                elif isinstance(first_val, str):
                    message = f"{first_key}: {first_val}"
                else:
                    message = f"Validation error on {first_key}"
        elif isinstance(details, list) and len(details) > 0:
            message = str(details[0])
        else:
            message = "An error occurred while processing your request."

        error_code = None
        if isinstance(details, dict) and 'code' in details:
            error_code = details['code']
        elif hasattr(exc, 'default_code'):
            error_code = exc.default_code

        response.data = {
            'success': False,
            'status_code': response.status_code,
            'error': {
                'type': error_type,
                'code': error_code,
                'message': message,
                'details': details
            }
        }
    else:
        # Unhandled 500 server error
        return Response(
            {
                'success': False,
                'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR,
                'error': {
                    'type': 'InternalServerError',
                    'message': 'A server error occurred. Please contact system administrator.',
                    'details': str(exc)
                }
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response
