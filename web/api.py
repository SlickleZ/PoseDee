import os,pathlib,requests
import time # for time only -> can be comment

from flask import Flask, render_template, request, redirect, url_for, session, abort, jsonify
from flask_dance.contrib.google import make_google_blueprint, google
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from pip._vendor import cachecontrol
import google.auth.transport.requests
import cv2
import math as m
import mediapipe as mp
import pyttsx3
import threading
import os
import datetime
import pandas as pd
import numpy as np
import plotly.express as px 
import plotly.graph_objects as go

from flask import Response

HOST_API = os.getenv("HOST_API") # private IP of api server

app = Flask(__name__)
app.secret_key = "-.SHEPHERD.-"  #it is necessary to set a password when dealing with OAuth 2.0
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"  #this is to set our environment to https because OAuth 2.0 only supports https environments

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")  #enter your client id you got from Google console
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

# -> ไปเก็บในหลังบ้านเเทน session + ควรเก็บเเต่ google id ด้วย

    session["google_id"] = id_info.get("sub")  #define the results to show on the page
    session["name"] = id_info.get("name")
    session["email"] = id_info.get("email")  #define the results to show on the page
    session["picture"] = id_info.get("picture")
    
    body = {
        "userId": session["google_id"],
        "email": session["email"],
        "name": session["name"]
    }
    headers = {'Content-Type': 'application/json'}

    requests.post(f"http://{HOST_API}:5000/api/users", json=body, headers=headers)

    # เพื่อเปลี่ยนเเปลงค่า proxy ของเว็ปให้เป็นฝั่ง client จาก server
    return redirect(f"http://localhost:3001/authen?name={session['name']}&email={session['email']}&picture={session['picture']}&userId={session['google_id']}")  #the final page where the authorized users will end up

@app.route("/logout")  #the logout page and function
def logout():
    session.clear()
    return redirect("/")

# ส่วนของกล้อง
# 1.Function to calculate offset distance
def findDistance(x1, y1, x2, y2):
    dist = m.sqrt((x2-x1)**2+(y2-y1)**2)
    return dist
# 2.Initilize medipipe selfie segmentation class.
mp_pose = mp.solutions.pose
mp_holistic = mp.solutions.holistic 

# 3.Calculate angle.
def findAngle(x1, y1, x2, y2):
    theta = m.acos((y2 - y1)*(-y1) /
                   (m.sqrt((x2 - x1)**2 + (y2 - y1)**2) * y1))
    degree = int(180/m.pi)*theta
    return degree
# 4.Font type.
font = cv2.FONT_HERSHEY_SIMPLEX  

# 5. set Colors.
blue = (255, 127, 0)
red = (50, 50, 255)
green = (127, 255, 0)
dark_blue = (127, 20, 0)
light_green = (127, 233, 100)
yellow = (0, 255, 255)
pink = (255, 0, 255)

# 6.Initialize mediapipe pose class.
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

#camera -> founded issue: zsh: segmentation fault  npm run start-api (sometimes)
is_camera_running = False

def generate_frames(userId):
    global is_camera_running
    
    # Meta.
    fps = int(camera.get(cv2.CAP_PROP_FPS))
    width = int(camera.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(camera.get(cv2.CAP_PROP_FRAME_HEIGHT))
    frame_size = (width, height)

    # Initilize frame counters.
    good_frames = 0
    bad_frames = 0
    
    postBody = {}
    
    def send_data():
        headers = {'Content-Type': 'application/json'}
        
        # print(f"{time.strftime('%X')}: Sending {postBody}")
        requests.post(f"http://{HOST_API}:5000/api/db/daily", json=postBody, headers=headers)
        # print("Sended!")
        
        
    daemon = threading.Thread(target=send_data, daemon=True, name='sending')
    prevTime = time.time()
    
    while is_camera_running:
        currentTime = time.time()
        success, image = camera.read()
        if not success:
            break
        else:
            # Get fps.
            fps = camera.get(cv2.CAP_PROP_FPS)
            # Get height and width.
            h, w = image.shape[:2]

            # Convert the BGR image to RGB.
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            # Process the image.
            keypoints = pose.process(image)

            # Convert the image back to BGR.
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            # Use lm and lmPose as representative of the following methods.
            lm = keypoints.pose_landmarks
            lmPose = mp_pose.PoseLandmark

            # Acquire the landmark coordinates.
            # Once aligned properly, left or right should not be a concern.
            if lm is not None:
                # Left shoulder.
                l_shldr_x = int(lm.landmark[lmPose.LEFT_SHOULDER].x * w)
                l_shldr_y = int(lm.landmark[lmPose.LEFT_SHOULDER].y * h)
                # Right shoulder
                r_shldr_x = int(lm.landmark[lmPose.RIGHT_SHOULDER].x * w)
                r_shldr_y = int(lm.landmark[lmPose.RIGHT_SHOULDER].y * h)
                # Left ear.
                l_ear_x = int(lm.landmark[lmPose.LEFT_EAR].x * w)
                l_ear_y = int(lm.landmark[lmPose.LEFT_EAR].y * h)
                # Left hip.
                l_hip_x = int(lm.landmark[lmPose.LEFT_HIP].x * w)
                l_hip_y = int(lm.landmark[lmPose.LEFT_HIP].y * h)
                # Calculate distance between left shoulder and right shoulder points.
                offset = findDistance(l_shldr_x, l_shldr_y, r_shldr_x, r_shldr_y)
                # Assist to align the camera to point at the side view of the person.
                    # Offset threshold 30 is based on results obtained from analysis over 100 samples.
                if offset < 100:
                    cv2.putText(image, str(int(offset)) + ' Aligned', (w - 150, 30), font, 0.9, green, 2)
                else:
                    cv2.putText(image, str(int(offset)) + ' Not Aligned',(w - 150, 30), font, 0.9, red, 2)

                # Calculate angles.
                neck_inclination = findAngle(
                    l_shldr_x, l_shldr_y, l_ear_x, l_ear_y)
                torso_inclination = findAngle(
                    l_hip_x, l_hip_y, l_shldr_x, l_shldr_y)

                # Draw landmarks.
                cv2.circle(image, (l_shldr_x, l_shldr_y), 7, yellow, -1)
                cv2.circle(image, (l_ear_x, l_ear_y), 7, yellow, -1)

                # Let's take y - coordinate of P3 100px above x1,  for display elegance.
                # Although we are taking y = 0 while calculating angle between P1,P2,P3.
                cv2.circle(image, (l_shldr_x, l_shldr_y - 100), 7, yellow, -1)
                cv2.circle(image, (r_shldr_x, r_shldr_y), 7, pink, -1)
                cv2.circle(image, (l_hip_x, l_hip_y), 7, yellow, -1)

                # Similarly, here we are taking y - coordinate 100px above x1. Note that
                # you can take any value for y, not necessarily 100 or 200 pixels.
                cv2.circle(image, (l_hip_x, l_hip_y - 100), 7, yellow, -1)

                # Put text, Posture and angle inclination.
                # Text string for display.
                angle_text_string = 'Neck : ' + \
                    str(int(neck_inclination)) + '  Torso : ' + \
                    str(int(torso_inclination))

                # Determine whether good posture or bad posture.
                # The threshold angles have been set based on intuition.
                if neck_inclination < 40 and torso_inclination < 10:
                    bad_frames = 0
                    good_frames += 1

                    cv2.putText(image, angle_text_string, (10, 30),
                                font, 0.9, light_green, 2)
                    cv2.putText(image, str(int(neck_inclination)),
                                (l_shldr_x + 10, l_shldr_y), font, 0.9, light_green, 2)
                    cv2.putText(image, str(int(torso_inclination)),
                                (l_hip_x + 10, l_hip_y), font, 0.9, light_green, 2)

                    # Join landmarks.
                    cv2.line(image, (l_shldr_x, l_shldr_y),
                            (l_ear_x, l_ear_y), green, 4)
                    cv2.line(image, (l_shldr_x, l_shldr_y),
                            (l_shldr_x, l_shldr_y - 100), green, 4)
                    cv2.line(image, (l_hip_x, l_hip_y),
                            (l_shldr_x, l_shldr_y), green, 4)
                    cv2.line(image, (l_hip_x, l_hip_y),
                            (l_hip_x, l_hip_y - 100), green, 4)

                else:
                    good_frames = 0
                    bad_frames += 1

                    cv2.putText(image, angle_text_string,
                                (10, 30), font, 0.9, red, 2)
                    cv2.putText(image, str(int(neck_inclination)),
                                (l_shldr_x + 10, l_shldr_y), font, 0.9, red, 2)
                    cv2.putText(image, str(int(torso_inclination)),
                                (l_hip_x + 10, l_hip_y), font, 0.9, red, 2)

                    # Join landmarks.
                    cv2.line(image, (l_shldr_x, l_shldr_y),
                            (l_ear_x, l_ear_y), red, 4)
                    cv2.line(image, (l_shldr_x, l_shldr_y),
                            (l_shldr_x, l_shldr_y - 100), red, 4)
                    cv2.line(image, (l_hip_x, l_hip_y),
                            (l_shldr_x, l_shldr_y), red, 4)
                    cv2.line(image, (l_hip_x, l_hip_y),
                            (l_hip_x, l_hip_y - 100), red, 4)

                # Calculate the time of remaining in a particular posture.
                good_time = (1 / fps) * good_frames
                bad_time = (1 / fps) * bad_frames

                # Pose time.
                if good_time > 0:
                    time_string_good = 'Good Posture Time : ' + \
                        str(round(good_time, 1)) + 's'
                    cv2.putText(image, time_string_good,
                                (10, h - 20), font, 0.9, green, 2)
                else:
                    time_string_bad = 'Bad Posture Time : ' + \
                        str(round(bad_time, 1)) + 's'
                    cv2.putText(image, time_string_bad,
                                (10, h - 20), font, 0.9, red, 2)
                        
                if currentTime - prevTime > 1:
                    prevTime = currentTime

                    postBody["Timestamp"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    postBody["neck_inclination"] = float(neck_inclination)
                    postBody["torso_inclination"] = float(torso_inclination)
                    postBody["Offset"] = float(offset)
                    postBody["Posture"] = 1 if good_time >= bad_time else 0
                    postBody["Side_Aligned"] = 1 if offset < 100 else 0
                    postBody["userId"] = userId
                    
                    daemon.start()
                    daemon = threading.Thread(target=send_data, daemon=True, name='sending')
                
                ret, buffer = cv2.imencode('.jpg', image)
                frame = buffer.tobytes()
                
                yield (b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            else:
                print(" ค่า default ")
                good_frames = 0
                bad_frames = 0
                success, frame = camera.read()
                if not success:
                    break
                else:
                    if lm is not None:
                        break
                    else:
                        ret, buffer = cv2.imencode('.jpg', frame)
                        frame = buffer.tobytes()
                        yield (b'--frame\r\n'
                            b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
                continue
            
@app.route('/video_feed', methods=["GET"])
def video_feed():
    userId = request.args.get("user_id")
    return Response(generate_frames(userId), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/start_camera')
def start_camera():
    global is_camera_running
    global camera
    if not is_camera_running:
        is_camera_running = True
        camera = cv2.VideoCapture(0)
    return 'Camera started'

@app.route('/stop_camera')
def stop_camera():
    global is_camera_running
    if is_camera_running:
        is_camera_running = False
        camera.release()
    return 'Camera stopped'

# ====================================== Dashboard ======================================

def daily_dash(userId):
    r = requests.get(f'http://{HOST_API}:5000/api/dash/hourly/{userId}')
    dash2 = pd.DataFrame(r.json(), columns=['Hour', 'Posture', 'Count'])
    dash2 = dash2.astype(dtype={'Hour': "int64", 'Posture': "int64", 'Count': "float64"})

    # Create a new dataframe with all 24 hours and null values for "Posture" and "Count"
    df_all_hours = pd.DataFrame({'Hour': list(range(24)), 'Posture': [None] * 24, 'Count': [None] * 24})

    # Merge the two dataframe using the "Hour" column as a key and keep all existing data
    dash2 = pd.merge(df_all_hours, dash2, on='Hour', how='left')

    dash2.drop(['Posture_x', 'Count_x'], axis=1, inplace=True)
    dash2['Posture_y'] = dash2['Posture_y'].replace({0: 'n', 1: 'y'})

    # Create the stack bar chart
    # Set the colors for the stack bar chart
    color_map = {"y": "#64E291", "n": "#EB7070"}
    fig1 = px.bar(dash2, x='Hour', y='Count_y', color='Posture_y', barmode='stack', color_discrete_map=color_map)
    fig1.update_layout(xaxis_title='Hour', yaxis_title='Minutes'
                    ,xaxis_tickmode='linear',xaxis_range=[-0.5, 23.7], yaxis_range=[0, 0.5], bargap=0.1)
    fig1.for_each_trace(lambda trace: trace.update(name='Good' if trace.name == 'y' else 'Bad'))
    return fig1.to_html(full_html=False)


# ====================================== WEEKLY DASHBOARD ======================================
def weekly_dash(userId):
    r = requests.get(f'http://{HOST_API}:5000/api/dash/weekly/{userId}')
    dash3 = pd.DataFrame(r.json(), columns=['Day', 'Day_Name', 'Posture', 'Count'])
    dash3 = dash3.astype(dtype={'Day': "int64", 'Day_Name': "object", 'Posture': "int64", 'Count': "float64"})

    # Create a new dataframe with all 24 hours and null values for "Posture" and "Count"]
    day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    df_all_day = pd.DataFrame({'Day_Name': day_order, 'Posture': [None] * 7, 'Count': [None] * 7})
    dash3 = pd.merge(df_all_day, dash3, on='Day_Name', how='left')
    dash3.drop(['Posture_x', 'Count_x'], axis=1, inplace=True)
    dash3['Posture_y'] = dash3['Posture_y'].replace({0: 'n', 1: 'y'})

    # Create the stack bar chart
    # Set the colors for the stack bar chart
    color_map = {"y": "#64E291", "n": "#EB7070"}
    fig2 = px.bar(dash3, x='Day_Name', y='Count_y', color='Posture_y', barmode='stack', color_discrete_map=color_map)
    fig2.update_layout(xaxis_title='Day', yaxis_title='Minitues'
                    ,xaxis_tickmode='linear', yaxis_range=[0, 0.002])
    # Update the color_discrete_map to change the  colors of the posture categories
    fig2.update_traces(marker_coloraxis=None)
    fig2.for_each_trace(lambda trace: trace.update(name='Good' if trace.name == 'y' else 'Bad'))
    return fig2.to_html(full_html=False)

# ====================================== MONTHLY DASHBOARD ======================================

def monthly_dash(userId):
    r = requests.get(f'http://{HOST_API}:5000/api/dash/monthly/{userId}')
    dash4 =  pd.DataFrame(r.json(), columns=['Day', 'Posture', 'Count'])
    dash4 = dash4.astype(dtype={'Day': "int64", 'Posture': "int64", 'Count': "float64"})

    week_order = dash4['Day'].unique().tolist()
    df_all_week = pd.DataFrame({'Day': week_order, 'Posture': [None] * len(week_order), 'Count': [None] * len(week_order)})
    dash4 = pd.merge(df_all_week, dash4, on='Day', how='left')
    dash4.drop(['Posture_x', 'Count_x'], axis=1, inplace=True)
    dash4['Posture_y'] = dash4['Posture_y'].replace({0: 'n', 1: 'y'})

    # Create the stack bar chart
    # Set the colors for the stack bar chart
    color_map = {"y": "#64E291", "n": "#EB7070"}
    fig3 = px.bar(dash4, x='Day', y='Count_y', color='Posture_y', barmode='stack', color_discrete_map=color_map)
    fig3.update_layout(xaxis_title='Date', yaxis_title='Hour',xaxis_tickmode='linear', xaxis_tick0=0, yaxis_range=[0, 0.005], bargap=0.1)
    # Update the color_discrete_map to change the colors of the posture categories
    fig3.update_traces(marker_coloraxis=None)
    fig3.for_each_trace(lambda trace: trace.update(name='Good' if trace.name == 'y' else 'Bad'))
    return fig3.to_html(full_html=False)

# ====================================== YEARLY DASHBOARD ======================================

def yearly_dash(userId):
    r = requests.get(f'http://{HOST_API}:5000/api/dash/yearly/{userId}')
    dash5 =  pd.DataFrame(r.json(), columns=['Month', 'Posture', 'Count'])
    dash5 = dash5.astype(dtype={'Month': "int64", 'Posture': "int64", 'Count': "float64"})

    months_order = [1,2,3,4,5,6,7,8,9,10,11,12]
    df_all_month = pd.DataFrame({'Month': months_order, 'Posture': [None] * 12, 'Count': [None] * 12})
    dash5 = pd.merge(df_all_month, dash5, on='Month', how='left')
    dash5.drop(['Posture_x', 'Count_x'], axis=1, inplace=True)

    months_map = {1:"January", 2:"February", 3:"March", 4:"April", 5:"May", 6:"June", 7:"July", 8:"August", 9:"September", 10:"October", 11:"November", 12:"December"}
    dash5['Month'] = dash5['Month'].replace(months_map)
    dash5['Posture_y'] = dash5['Posture_y'].replace({0: 'n', 1: 'y'})

    # Set the colors for the stack bar chart
    color_map = {"y": "#64E291", "n": "#EB7070"}
    fig4 = px.bar(dash5, x='Month', y='Count_y', color='Posture_y', barmode='stack', color_discrete_map=color_map)
    fig4.update_layout(xaxis_title='Month', yaxis_title='Hour',xaxis_tickmode='linear', xaxis_tick0=0, yaxis_range=[0, 0.00005], bargap=0.3)
    # Update the color_discrete_map to change the colors of the posture categories
    fig4.update_traces(marker_coloraxis=None)
    fig4.for_each_trace(lambda trace: trace.update(name='Good' if trace.name == 'y' else 'Bad'))
    return fig4.to_html(full_html=False)

# ====================================== GAUGE DASHBOARD ======================================

def gauge_dash(userId):
    r = requests.get(f'http://{HOST_API}:5000/api/dash/gauge/{userId}')
    dash6 =  pd.DataFrame(r.json(), columns=['Posture', 'Count'])
    dash6 = dash6.astype(dtype={'Posture': "int64", 'Count': "int64"})

    if dash6.empty:
        Good_Percentage = 0.00
    else:
        good = int(dash6[dash6["Posture"] == 1]["Count"])
        bad = int(dash6[dash6["Posture"] == 0]["Count"])
        Good_Percentage =  round((good / (good + bad)) * 100, 2)

    if Good_Percentage <= 30:
        color = '#EB7070'
    elif Good_Percentage >= 30 and Good_Percentage < 60:
        color = '#FEC771'
    else:
        color = '#64E291'

    fig5 = go.Figure(go.Indicator(
        mode = "gauge+number",
        value = Good_Percentage,
        domain = {'x': [0, 1], 'y': [0, 1]},
        gauge = {
            'axis': {'range': [None, 100]},
            'threshold': {
                'value': 30,'line': {'color': color, 'width': 5},
            },
            'threshold': {
                'value': 59,'line': {'color': color, 'width': 5},
            },
            'threshold': {
                'value': 60,'line': {'color': color, 'width': 5},
            },
            'bar': {'color': color}
        }
    ))
    return fig5.to_html(full_html=False)

@app.route('/dashboard/<userIdDashboard>')
def dashboardPage(userIdDashboard):
    return render_template('dashboard.html', host=HOST_API, userId=userIdDashboard, fig1=daily_dash(userIdDashboard), fig2=weekly_dash(userIdDashboard), fig3=monthly_dash(userIdDashboard), fig4=yearly_dash(userIdDashboard), fig5=gauge_dash(userIdDashboard))

if __name__ == '__main__':
    app.run(host='0.0.0.0')