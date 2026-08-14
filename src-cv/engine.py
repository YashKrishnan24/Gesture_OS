import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import pyautogui
import threading
import uvicorn
import time
from ml_engine import GestureRecognizer
from normalizer import normalize_landmarks
import config_manager
import shared_state

def run_api():
    uvicorn.run("api:app", host="127.0.0.1", port=8081, reload=False)

import ctypes

def send_media_key(key_code):
    ctypes.windll.user32.keybd_event(key_code, 0, 1, 0)
    time.sleep(0.05)
    ctypes.windll.user32.keybd_event(key_code, 0, 1 | 2, 0)

def execute_os_action(action_name):
    print(f"[OS] Executing Action: {action_name}")
    if action_name == "playpause":
        send_media_key(0xB3)
    elif action_name == "nexttrack":
        send_media_key(0xB0)
    elif action_name == "prevtrack":
        send_media_key(0xB1)
    elif action_name == "volumeup":
        send_media_key(0xAF)
    elif action_name == "volumedown":
        send_media_key(0xAE)
    elif action_name == "scrollup":
        pyautogui.scroll(300)
    elif action_name == "scrolldown":
        pyautogui.scroll(-300)
    elif action_name == "show_desktop":
        pyautogui.hotkey("win", "d")
    elif action_name == "switch_window":
        pyautogui.hotkey("alt", "tab")
    elif action_name == "save_file":
        pyautogui.hotkey("ctrl", "s")
    elif action_name == "refresh_page":
        pyautogui.press("f5")
    elif action_name == "copy":
        pyautogui.hotkey("ctrl", "c")
    elif action_name == "paste":
        pyautogui.hotkey("ctrl", "v")
    elif action_name == "undo":
        pyautogui.hotkey("ctrl", "z")
    elif action_name == "zoom_in":
        pyautogui.hotkey("ctrl", "+")
    elif action_name == "zoom_out":
        pyautogui.hotkey("ctrl", "-")
    elif action_name == "screenshot":
        pyautogui.hotkey("win", "shift", "s")
    elif action_name == "mute":
        send_media_key(0xAD)
    elif action_name == "lock_screen":
        pyautogui.hotkey("win", "l")

def main():
    api_thread = threading.Thread(target=run_api, daemon=True)
    api_thread.start()

    base_options = python.BaseOptions(model_asset_path='hand_landmarker.task')
    options = vision.HandLandmarkerOptions(base_options=base_options, num_hands=1)
    detector = vision.HandLandmarker.create_from_options(options)

    cap = cv2.VideoCapture(0)
    recognizer = GestureRecognizer(dtw_threshold=20.0)
    
    print("[Engine] Started ML tracking in background...")

    recording_buffer = []
    live_buffer = []
    last_action_time = time.time()
    BUFFER_SIZE = 15 # Sliding window size

    try:
        while cap.isOpened():
            success, image = cap.read()
            if not success:
                continue

            config = config_manager.load_config()
            cooldown = config["settings"].get("cooldown", 1.0)
            is_active = config["settings"].get("is_active", True)

            image = cv2.flip(image, 1)
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image_rgb)
            detection_result = detector.detect(mp_image)

            if detection_result.hand_landmarks:
                # We only process the first hand detected
                hand_landmarks = detection_result.hand_landmarks[0]
                
                # Draw wrist dot
                h, w, c = image.shape
                cx, cy = int(hand_landmarks[0].x * w), int(hand_landmarks[0].y * h)
                cv2.circle(image, (cx, cy), 10, (255, 0, 0), cv2.FILLED)
                
                normalized = normalize_landmarks(hand_landmarks)

                if shared_state.is_recording:
                    recording_buffer.append(normalized)
                    # Stop recording after 30 frames
                    if len(recording_buffer) >= 30:
                        recognizer.add_template(shared_state.recording_gesture_name, recording_buffer)
                        print(f"[Record] Finished recording '{shared_state.recording_gesture_name}'")
                        shared_state.is_recording = False
                        recording_buffer = []
                        live_buffer = [] # clear live buffer
                else:
                    if is_active:
                        live_buffer.append(normalized)
                        if len(live_buffer) > BUFFER_SIZE:
                            live_buffer.pop(0)

                        current_time = time.time()
                        if current_time - last_action_time > cooldown and len(live_buffer) == BUFFER_SIZE:
                            best_match, distance = recognizer.recognize(live_buffer)
                            
                            if best_match:
                                print(f"[Match] {best_match} (dist: {distance:.2f})")
                                mappings = config["mappings"]
                                if best_match in mappings:
                                    os_action = mappings[best_match]
                                    execute_os_action(os_action)
                                    last_action_time = current_time
                                    live_buffer = [] # Clear buffer so we don't trigger back-to-back

            # UI Text
            if shared_state.is_recording:
                cv2.putText(image, f"RECORDING '{shared_state.recording_gesture_name}': {len(recording_buffer)}/30", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 165, 255), 2)
            else:
                status_text = "ACTIVE" if is_active else "PAUSED"
                color = (0, 255, 0) if is_active else (0, 0, 255)
                cv2.putText(image, f"Status: {status_text}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
                cv2.putText(image, f"Templates Loaded: {sum(len(v) for v in recognizer.templates.values())}", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)

            # Stream to UI
            ret, buffer = cv2.imencode('.jpg', image, [cv2.IMWRITE_JPEG_QUALITY, 50])
            if ret:
                shared_state.latest_frame = buffer.tobytes()

    finally:
        cap.release()

if __name__ == "__main__":
    main()
