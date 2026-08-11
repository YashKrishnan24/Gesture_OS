import json
import os

CONFIG_FILE = "config.json"

DEFAULT_CONFIG = {
    "settings": {
        "swipe_threshold": 0.15,
        "cooldown": 1.0,
        "is_active": True
    },
    "mappings": {
        "wake_sleep": "toggle_active",
        "play_pause": "playpause",
        "next_track": "nexttrack",
        "prev_track": "prevtrack",
        "volume_up": "volumeup",
        "volume_down": "volumedown",
        "scroll_up": "scrollup",
        "scroll_down": "scrolldown",
        "show_desktop": "show_desktop",
        "switch_window": "switch_window",
        "save_file": "save_file",
        "refresh_page": "refresh_page"
    }
}

def load_config():
    if not os.path.exists(CONFIG_FILE):
        save_config(DEFAULT_CONFIG)
        return DEFAULT_CONFIG
    try:
        with open(CONFIG_FILE, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"[Config] Error loading config: {e}")
        return DEFAULT_CONFIG

def save_config(config):
    try:
        with open(CONFIG_FILE, "w") as f:
            json.dump(config, f, indent=4)
        return True
    except Exception as e:
        print(f"[Config] Error saving config: {e}")
        return False

def update_mapping(gesture_id, os_action):
    config = load_config()
    config["mappings"][gesture_id] = os_action
    return save_config(config)

def update_setting(key, value):
    config = load_config()
    config["settings"][key] = value
    return save_config(config)
