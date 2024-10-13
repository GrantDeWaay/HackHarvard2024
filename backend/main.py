import base64
import os
from pathlib import Path
from dotenv import load_dotenv
from flask import Flask, request, jsonify
import openai
import subprocess

from order import Order

UPLOAD_FOLDER = "uploads"

app = Flask(__name__)


# Set your OpenAI API key

# Array to store transcriptions
transcriptions = []
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
client = openai.OpenAI()

order = Order()

# Endpoint to handle MP3 upload and transcription
@app.route("/transcribe", methods=["POST"])
def transcribe_audio():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    webm_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(webm_path)

    wav_filename = os.path.splitext(file.filename)[0] + ".wav"
    wav_path = os.path.join(UPLOAD_FOLDER, wav_filename)

    try:
        subprocess.run(["ffmpeg", "-y", "-i", webm_path, wav_path], check=True)
    except subprocess.CalledProcessError as e:
        return jsonify({"error": "Conversion failed", "message": str(e)}), 500

    # Transcribe the audio using OpenAI API
    with open(wav_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            model="whisper-1", file=audio_file
        )
    return order.conversation(transcription.text)
    

@app.route("/upload", methods=["OPTIONS"])
def upload_options():
    return "", 20


@app.route("/clear", methods=["GET"])
def clear_array():
    order.clear()
    return "", 200


# Endpoint to view all transcriptions
@app.route("/transcriptions", methods=["GET"])
def get_transcriptions():
    return jsonify(transcriptions), 200


if __name__ == "__main__":
    os.makedirs("uploads", exist_ok=True)
    app.run(debug=True, port=5000)
