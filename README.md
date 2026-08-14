# GestureOS

GestureOS is a desktop application that allows you to control your operating system using custom hand gestures through your webcam. By leveraging computer vision and dynamic time warping algorithms, the system recognizes real-time hand movements and translates them into system-level commands, creating a seamless and touchless interaction experience.

## Features

*   **Custom Gesture Mapping**: Record and train the system to recognize your own unique hand gestures.
*   **Real-time Recognition**: Utilizes efficient machine learning models for low-latency, real-time hand tracking and action triggering.
*   **System Integration**: Natively controls Windows OS functions such as media playback, volume control, window management, and custom keystrokes.
*   **Modern Dashboard**: A clean, responsive Next.js frontend for managing your gestures, adjusting configurations, and monitoring the live camera feed.
*   **Privacy First**: All processing is done locally on your machine. No video data is sent to external servers.

## Architecture Overview

The project is built on a split architecture separating the machine learning engine from the user interface:

*   **Computer Vision Engine (`src-cv`)**: Built with Python. It uses MediaPipe for high-performance hand landmark detection and Dynamic Time Warping (DTW) to classify temporal gesture sequences. It runs a local FastAPI server to expose endpoints and stream the MJPEG camera feed.
*   **User Interface (`src-ui`)**: Built with Next.js, React, and Tailwind CSS. It communicates with the Python backend to provide an intuitive dashboard for mapping actions, recording new gestures, and monitoring system state.

## Prerequisites

*   Python 3.8 or higher
*   Node.js 18 or higher
*   A working webcam
*   Windows OS (for native system controls)

## Installation & Setup

### 1. Setup the Backend Engine

Navigate to the computer vision directory and install the required Python dependencies:

```bash
cd src-cv
pip install -r requirements.txt
```

Start the background Python engine:

```bash
python engine.py
```

*Note: The engine will automatically start the FastAPI server on port 8081.*

### 2. Setup the Frontend Interface

Open a new terminal window, navigate to the user interface directory, and install the Node dependencies:

```bash
cd src-ui
npm install
```

Start the Next.js development server:

```bash
npm run dev
```

## Usage

1.  Ensure both the `engine.py` script and the Next.js frontend are running.
2.  Open your browser and navigate to `http://localhost:3000`.
3.  Proceed through the authentication screen to access your dashboard.
4.  Navigate to the "Dashboard" tab to view available actions.
5.  Click "Map Gesture" on any action to open the recording modal. Name your gesture, click start, and perform the movement in front of your camera.
6.  Once saved, performing that gesture will automatically trigger the mapped action on your operating system.

## License

This project is open-source and available for use and modification.
