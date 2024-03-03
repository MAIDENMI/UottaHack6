'''This script detects if a person is drowsy or not,using dlib and eye aspect ratio
calculations. Uses webcam video feed as input.'''

#Import necessary libraries
from scipy.spatial import distance
from imutils import face_utils
import imutils
import numpy as np
import pygame #For playing sound
import time
import dlib
import cv2

#Initialize Pygame and load music
pygame.mixer.init()
pygame.mixer.music.load('drowsy_files/rooster-crow.wav')

#Minimum threshold of eye aspect ratio below which alarm is triggerd
EYE_ASPECT_RATIO_THRESHOLD = 0.30

#Minimum consecutive frames for which eye ratio is below threshold for alarm to be triggered
EYE_ASPECT_RATIO_CONSEC_FRAMES = 30

#COunts no. of consecutuve frames below threshold value
COUNTER = 0

#Load face cascade which will be used to draw a rectangle around detected faces.
face_cascade = cv2.CascadeClassifier("drowsy_files/haarcascade_frontalface_default.xml")

#This function calculates and return eye aspect ratio
def eye_aspect_ratio(eye):
    A = distance.euclidean(eye[1], eye[5])
    B = distance.euclidean(eye[2], eye[4])
    C = distance.euclidean(eye[0], eye[3])

    ear = (A+B) / (2*C)
    return ear

#Load face detector and predictor, uses dlib shape predictor file
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor('drowsy_files/shape_predictor_68_face_landmarks.dat')

#Extract indexes of facial landmarks for the left and right eye
(lStart, lEnd) = face_utils.FACIAL_LANDMARKS_IDXS['left_eye']
(rStart, rEnd) = face_utils.FACIAL_LANDMARKS_IDXS['right_eye']

#Start webcam video capture
video_capture = cv2.VideoCapture(0)
running = True

#Give some time for camera to initialize(not required)
time.sleep(1)

while(True):
    if(running):
        if(not video_capture.isOpened()):
            video_capture = cv2.VideoCapture(0)

        #Read each frame and flip it, and convert to grayscale
        ret, frame = video_capture.read()
        frame = cv2.flip(frame,1)
        frame = imutils.resize(frame, width = 500, height = 500)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        #Detect facial points through detector function
        faces = detector(gray, 0)

        #Detect faces through haarcascade_frontalface_default.xml
        face_rectangle = face_cascade.detectMultiScale(gray, 1.3, 5)

        #Detect facial points
        for face in faces:

            shape = predictor(gray, face)
            shape = face_utils.shape_to_np(shape)

            #Get array of coordinates of leftEye and rightEye
            leftEye = shape[lStart:lEnd]
            rightEye = shape[rStart:rEnd]

            #Calculate aspect ratio of both eyes
            leftEyeAspectRatio = eye_aspect_ratio(leftEye)
            rightEyeAspectRatio = eye_aspect_ratio(rightEye)

            eyeAspectRatio = (leftEyeAspectRatio + rightEyeAspectRatio) / 2

            #Detect if eye aspect ratio is less than threshold
            if(eyeAspectRatio < EYE_ASPECT_RATIO_THRESHOLD):
                COUNTER += 1
                #If no. of frames is greater than threshold frames,
                if COUNTER >= EYE_ASPECT_RATIO_CONSEC_FRAMES:
                    pygame.mixer.music.play(-1)
            else:
                pygame.mixer.music.stop()
                COUNTER = 0

        #Show video feed
        cv2.imshow('Video', frame)
        if(cv2.waitKey(1) == ord('q')):
            break
        if(cv2.waitKey(2) == ord('s')):
            running = False
    else:

        #Close the video function
        video_capture.release()
        pygame.mixer.music.stop()
        COUNTER = 0

        #Show video feed
        cv2.imshow('Video', frame)
        if(cv2.waitKey(1) == ord('q')):
            break
        if(cv2.waitKey(2) == ord('r')):
            running = True

#Finally when video capture is over, release the video capture and destroyAllWindows
pygame.mixer.music.stop()
video_capture.release()
cv2.destroyAllWindows()