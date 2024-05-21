from src.server.web_application import WebApplication
from pyvirtualdisplay import Display


def create_app():
    display = Display(visible=False, size=(800, 600))
    display.start()

    application = WebApplication(__name__, '../../dist/cookie-scanner')
    return application.run()