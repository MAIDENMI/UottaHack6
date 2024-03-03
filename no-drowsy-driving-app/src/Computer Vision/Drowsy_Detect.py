import asyncio
import websockets
import base64
from scipy.spatial import distance
from imutils import face_utils
import imutils
import numpy as np
import pygame  # For playing sound
import time
import dlib
import cv2


# Initialize Pygame and load music
pygame.mixer.init()
pygame.mixer.music.load('drowsy_files/alert.wav')

EYE_ASPECT_RATIO_THRESHOLD = 0.30
EYE_ASPECT_RATIO_CONSEC_FRAMES = 60
COUNTER = 0

face_cascade = cv2.CascadeClassifier("drowsy_files/haarcascade_frontalface_default.xml")

def eye_aspect_ratio(eye):
    A = distance.euclidean(eye[1], eye[5])
    B = distance.euclidean(eye[2], eye[4])
    C = distance.euclidean(eye[0], eye[3])
    ear = (A + B) / (2.0 * C)
    return ear

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor('drowsy_files/shape_predictor_68_face_landmarks.dat')
(lStart, lEnd) = face_utils.FACIAL_LANDMARKS_IDXS['left_eye']
(rStart, rEnd) = face_utils.FACIAL_LANDMARKS_IDXS['right_eye']

async def send_video(websocket, path):
    video_capture = cv2.VideoCapture(0)
    video_capture.set(cv2.CAP_PROP_FRAME_WIDTH, 440)
    video_capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 380)
    frame_rate = video_capture.get(cv2.CAP_PROP_FPS)
    print("Frame rate:", frame_rate, "frames per second")
    global COUNTER

    while True:
        ret, frame = video_capture.read()
        if not ret:
            break
        frame = cv2.flip(frame, 1)
        frame = imutils.resize(frame, width=450)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = detector(gray, 0)

        for face in faces:
            shape = predictor(gray, face)
            shape = face_utils.shape_to_np(shape)
            leftEye = shape[lStart:lEnd]
            rightEye = shape[rStart:rEnd]
            leftEyeAspectRatio = eye_aspect_ratio(leftEye)
            rightEyeAspectRatio = eye_aspect_ratio(rightEye)
            eyeAspectRatio = (leftEyeAspectRatio + rightEyeAspectRatio) / 2

            leftEyeHull = cv2.convexHull(leftEye)
            rightEyeHull = cv2.convexHull(rightEye)
            cv2.drawContours(frame, [leftEyeHull], -1, (0, 255, 0), 1)
            cv2.drawContours(frame, [rightEyeHull], -1, (0, 255, 0), 1)

            if eyeAspectRatio < EYE_ASPECT_RATIO_THRESHOLD:
                COUNTER += 1
                if COUNTER >= EYE_ASPECT_RATIO_CONSEC_FRAMES:
                    pygame.mixer.music.play(-1)
                    cv2.putText(frame, "DROWSY", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                    await websocket.send("ALERT: Drowsy detected!")
            else:
                pygame.mixer.music.stop()
                COUNTER = 0

        _, buffer = cv2.imencode('.jpg', frame)
        jpg_as_text = base64.b64encode(buffer).decode()
        await websocket.send(jpg_as_text)

async def server():
    async with websockets.serve(send_video, "localhost", 8765):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(server())
