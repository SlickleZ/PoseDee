import os,pathlib,requests
import time # for time only -> can be comment

from flask import Flask, render_template, request, redirect, url_for, session, abort
from flask_dance.contrib.google import make_google_blueprint, google
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from pip._vendor import cachecontrol
import google.auth.transport.requests

app = Flask(__name__)
app.secret_key = "-.SHEPHERD.-"  #it is necessary to set a password when dealing with OAuth 2.0
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"  #this is to set our environment to https because OAuth 2.0 only supports https environments

GOOGLE_CLIENT_ID = "341516343925-hec8ev3qr9832gpsqct5cu31ganslqf3.apps.googleusercontent.com"  #enter your client id you got from Google console
client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client_secret.json")  #set the path to where the .json file you got Google console is

flow = Flow.from_client_secrets_file(  #Flow is OAuth 2.0 a class that stores all the information on how we want to authorize our users
    client_secrets_file=client_secrets_file,
    scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],  #here we are specifing what do we get after the authorization
    redirect_uri="http://127.0.0.1:5000/callback"  #and the redirect URI is the point where the user will end up after the authorization
)

def Oauth_is_required(function):  #a function to check if the user is authorized or not
    def wrapper(*args, **kwargs):
        if "google_id" not in session:  #authorization required
            return abort(401)
        else:
            return function()

    return wrapper

# For testing get time in react app
@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route("/Oauth")  #the page where the user can login
def Oauth():
    authorization_url, state = flow.authorization_url()  #asking the flow class for the authorization (login) url
    session["state"] = state
    return redirect(authorization_url)

@app.route("/callback")  #this is the page that will handle the callback process meaning process after the authorization
def callback():
    flow.fetch_token(authorization_response=request.url)
    if not session["state"] == request.args["state"]:
        abort(500)  #state does not match!

    credentials = flow.credentials
    request_session = requests.session()
    cached_session = cachecontrol.CacheControl(request_session)
    token_request = google.auth.transport.requests.Request(session=cached_session)

    id_info = id_token.verify_oauth2_token(
        id_token = credentials._id_token,
        request = token_request,
        audience = GOOGLE_CLIENT_ID
    )
    
#TODO -> ไปเก็บในหลังบ้านเเทน session + ควรเก็บเเต่ google id ด้วย

    session["google_id"] = id_info.get("sub")  #defing the results to show on the page
    session["name"] = id_info.get("name")
    session["email"] = id_info.get("email")  #defing the results to show on the page
    session["picture"] = id_info.get("picture")
    # เพื่อเปลี่ยนเเปลงค่า proxy ของเว็ปให้เป็นฝั่ง client จาก server
    return redirect(f"http://localhost:3001/callback?name={session['name']}&email={session['email']}&picture={session['picture']}")  #the final page where the authorized users will end up

@app.route("/logout")  #the logout page and function
def logout():
    session.clear()
    return redirect("/")

# @app.route("/protected_area")  #the page where only the authorized users can go to -> เก็บใน cookie เเทนเลยเอาออก
# @Oauth_is_required
# def protected_area():
#     return f"Hello {session['name']}! <br/> <a href='/logout'><button>Logout</button></a>"  #the logout button 

if __name__ == '__main__':
    app.run(debug=True)
