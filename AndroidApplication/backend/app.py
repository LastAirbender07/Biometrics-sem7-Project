import cv2
import face_recognition
import os
import numpy as np
import pandas as pd
import base64
from datetime import datetime
from flask import Flask, request, jsonify
import socket
import requests

UPLOAD_FOLDER = r'/train'

app = Flask(__name__)
app.secret_key = "secret key"

# Load and encode the images for known users
def load_known_faces():
    path = "train"
    images = []
    classNames = []
    myList = os.listdir(path)

    for cl in myList:
        curImg = cv2.imread(f'{path}/{cl}')
        images.append(curImg)
        classNames.append(os.path.splitext(cl)[0])

    def findEncodings(images):
        encodeList = []
        for img in images:
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            encode = face_recognition.face_encodings(img)[0]
            encodeList.append(encode)
        return encodeList  
    
    encodeListKnown = findEncodings(images)
    return encodeListKnown, classNames

encodeListKnown, classNames = load_known_faces()

def recognize_face(img, encodeListKnown, classNames, threshold=0.6, confidence_threshold=50):
    imgS = cv2.resize(img, (0, 0), None, 0.25, 0.25)
    imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)

    facesCurFrame = face_recognition.face_locations(imgS)
    encodesCurFrame = face_recognition.face_encodings(imgS, facesCurFrame)

    if not encodesCurFrame:
        print('No faces detected')
        return "No faces detected", None

    for encodeFace in encodesCurFrame:
        matches = face_recognition.compare_faces(encodeListKnown, encodeFace, tolerance=threshold)
        faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)
        matchIndex = np.argmin(faceDis)

        if matches[matchIndex]:
            accuracy = (1 - faceDis[matchIndex]) * 100
            name = classNames[matchIndex].upper()
            if accuracy >= confidence_threshold:
                print(f'Authenticated as {name} with {round(accuracy, 2)}% accuracy')
                return name, round(accuracy, 2)
            else:
                print(f'Face recognized as {name}, but confidence {round(accuracy, 2)}% is below threshold. Marked as Unknown.')
                return "Unknown", round(accuracy, 2)

    return "Unable to recognize face", None

def update_ip_in_json_bin():
    hostname = socket.gethostname()
    IPAddr = socket.gethostbyname(hostname)

    print("Your Computer Name is:" + hostname)
    print("Your Computer IP Address is:" + IPAddr)

    json_bin_id = '766b9c024d94'  # Your JSON bin ID
    url = f'https://json.extendsclass.com/bin/{json_bin_id}'
    data = {"ip_address": IPAddr}
    headers = { 'Content-Type': 'application/merge-patch+json' }
    response = requests.patch(url, json=data, headers=headers)

    if response.status_code == 200:
        print('IP address updated successfully.')
    else:
        print('Failed to update IP address:', response.json())

update_ip_in_json_bin()

@app.route('/authenticate', methods=['POST'])
def authenticate():
    print('Authenticating...')
    try:
        data = request.json
        if not data or 'image' not in data:
            return jsonify({'message': 'No image provided'}), 400
        try:
            img_data = base64.b64decode(data['image'])
        except (TypeError, ValueError) as e:
            print(f'Error decoding base64 image: {e}')
            return jsonify({'message': 'Invalid image data'}), 400
        
        print('Image received')
        temp_image_path = 'temp.jpg'
        try:
            with open(temp_image_path, 'wb') as f:
                f.write(img_data)
        except IOError as e:
            print(f'Error saving the image: {e}')
            return jsonify({'message': 'Failed to process the image'}), 500
        
        print(f'Image saved as {temp_image_path}')
        try:
            img = face_recognition.load_image_file(temp_image_path)
        except Exception as e:
            print(f'Error loading the image: {e}')
            return jsonify({'message': 'Failed to process the image'}), 500
        name, accuracy = recognize_face(img, encodeListKnown, classNames)

        if name == "No faces detected":
            return jsonify({'message': 'No faces detected in the image'}), 400
        elif name and accuracy:
            return jsonify({'message': f'Authenticated as {name}', 'accuracy': accuracy, 'name': name}), 200
        else:
            return jsonify({'message': 'Unable to recognize face'}), 401

    except Exception as e:
        print(f'Unexpected error: {e}')
        return jsonify({'message': 'Internal server error'}), 500

    finally:
        try:
            if os.path.exists(temp_image_path):
                os.remove(temp_image_path)
                print(f'Temporary image {temp_image_path} deleted')
        except Exception as e:
            print(f'Error deleting the temporary image: {e}')

@app.route('/register', methods=['POST'])
def register():
    print('Registering new user...')
    try:
        data = request.json
        if not data or 'image' not in data or 'name' not in data:
            return jsonify({'message': 'Name and image are required'}), 400

        name = data['name'].strip()
        if not name:
            return jsonify({'message': 'Name cannot be empty'}), 400

        try:
            img_data = base64.b64decode(data['image'])
        except (TypeError, ValueError) as e:
            print(f'Error decoding base64 image: {e}')
            return jsonify({'message': 'Invalid image data'}), 400

        print(f'Received registration for {name}')
        image_path = os.path.join('train', f'{name}.jpg')
        try:
            with open(image_path, 'wb') as f:
                f.write(img_data)
        except IOError as e:
            print(f'Error saving the image: {e}')
            return jsonify({'message': 'Failed to save the image'}), 500

        print(f'Image saved for {name} at {image_path}')

        global encodeListKnown, classNames
        encodeListKnown, classNames = load_known_faces()

        return jsonify({'message': f'User {name} registered successfully'}), 200

    except Exception as e:
        print(f'Unexpected error: {e}')
        return jsonify({'message': 'Internal server error'}), 500


@app.route('/')
def index():
    return 'Welcome to Face Recognition API'

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
