from exponent_server_sdk import DeviceNotRegisteredError
from exponent_server_sdk import PushClient
from exponent_server_sdk import PushMessage
from exponent_server_sdk import PushResponseError
from exponent_server_sdk import PushServerError
from requests.exceptions import ConnectionError
from requests.exceptions import HTTPError
import requests
import asyncio
from threading import Thread


class PushNotificationWorker(object):
    """
    Worker used to send push notifications

    Usage: PushNotificationWorker().queue_task(pushNotificationFunction, args)
    Where pushNotificationFunction is a function that send the notifications and
    args is a tuple with all the arguments that pushNotificationFunction needs
    """

    def __init__(self):
        # Create the new loop and worker thread
        self.worker_loop = asyncio.new_event_loop()
        worker = Thread(target=self.start_push_notification_worker, args=(self.worker_loop,))
        # Start the thread
        worker.start()

    def start_push_notification_worker(self, loop):
        """Switch to new event loop and run forever"""
        asyncio.set_event_loop(loop)
        loop.run_forever()

    def send_push_notification(self, token, message, channel_id, extra=None):
        # Basic arguments. You should extend this function with the push features you
        # want to use, or simply pass in a `PushMessage` object.
        try:
            response = PushClient().publish(
                PushMessage(to=token,
                            body=message,
                            data=extra,
                            channel_id=channel_id))
        except PushServerError as exc:
            # Encountered some likely formatting/validation error.
            rollbar.report_exc_info(
                extra_data={
                    'token': token,
                    'message': message,
                    'extra': extra,
                    'errors': exc.errors,
                    'response_data': exc.response_data,
                })
            raise
        except (ConnectionError, HTTPError) as exc:
            # Encountered some Connection or HTTP error - retry a few times in
            # case it is transient.
            rollbar.report_exc_info(
                extra_data={'token': token, 'message': message, 'extra': extra})
            raise self.retry(exc=exc)

        try:
            # We got a response back, but we don't know whether it's an error yet.
            # This call raises errors so we can handle them with normal exception
            # flows.
            response.validate_response()
        except DeviceNotRegisteredError:
            # Mark the push token as inactive
            from notifications.models import PushToken
            PushToken.objects.filter(token=token).update(active=False)
        except PushResponseError as exc:
            # Encountered some other per-notification error.
            rollbar.report_exc_info(
                extra_data={
                    'token': token,
                    'message': message,
                    'extra': extra,
                    'push_response': exc.push_response._asdict(),
                })
            raise self.retry(exc=exc)

    def send_push_notifications(self, tokens, *args, **kwargs):
        for token in tokens:
            self.send_push_notification(token, *args, **kwargs)

    def queue_task(self, func, args):
        """
        Used to queue a task for the worker.
        @param: func is a function that the worker should execute when it can
        @param: args is a tuple with all the arguments that func needs
        """
        self.worker_loop.call_soon_threadsafe(func, *args)


push_notification_worker = PushNotificationWorker()
