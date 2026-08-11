from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import config_manager
import shared_state

app = FastAPI(title="GestureOS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MappingRequest(BaseModel):
    gesture_id: str
    os_action: str

class SettingRequest(BaseModel):
    key: str
    value: float

class RecordRequest(BaseModel):
    gesture_id: str
    os_action: str

@app.get("/api/config")
def get_config():
    return config_manager.load_config()

@app.post("/api/mappings")
def update_mapping(req: MappingRequest):
    success = config_manager.update_mapping(req.gesture_id, req.os_action)
    return {"status": "ok" if success else "error"}

@app.post("/api/settings")
def update_setting(req: SettingRequest):
    success = config_manager.update_setting(req.key, req.value)
    return {"status": "ok" if success else "error"}

@app.post("/api/record")
def start_recording(req: RecordRequest):
    shared_state.recording_gesture_name = req.gesture_id
    shared_state.recording_action_name = req.os_action
    shared_state.is_recording = True
    # We also update mapping immediately
    config_manager.update_mapping(req.gesture_id, req.os_action)
    return {"status": "recording_started", "message": f"Perform the '{req.gesture_id}' gesture in the camera."}

@app.get("/api/status")
def get_status():
    config = config_manager.load_config()
    return {
        "status": "ok", 
        "is_active": config["settings"].get("is_active", True),
        "is_recording": shared_state.is_recording,
        "recording_gesture": shared_state.recording_gesture_name
    }
