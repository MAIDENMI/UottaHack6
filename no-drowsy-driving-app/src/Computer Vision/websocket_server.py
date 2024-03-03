import asyncio
import websockets
import cv2
import base64

async def send_video(websocket, path):
    print(f"Client connected: {path}")  # Notify when a client connects
    video_capture = cv2.VideoCapture(0)  # 0 is usually the default camera
    try:
        while True:
            ret, frame = video_capture.read()
            if not ret:
                break  # Stop if we can't get a frame
            ret, buffer = cv2.imencode('.jpg', frame)
            jpg_as_text = base64.b64encode(buffer).decode()
            await websocket.send(jpg_as_text)
            await asyncio.sleep(0.1)  # Adjust sleep time as needed
    finally:
        video_capture.release()

async def main():
    start_server = websockets.serve(send_video, "localhost", 8765)
    print("WebSocket server started at ws://localhost:8765. Waiting for clients to connect...")
    await start_server  # Start the server and print a message

asyncio.run(main())
