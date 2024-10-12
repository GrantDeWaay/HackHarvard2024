import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import subprocess

UPLOAD_FOLDER = "uploads"

app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
)

# Set your OpenAI API key

# Array to store transcriptions
transcriptions = []

client = openai.OpenAI()


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

    # Save transcription to array
    transcriptions.append(transcription.text)

    # Respond with transcription
    return jsonify({"transcription": transcription.text}), 200


@app.route("/upload", methods=["OPTIONS"])
def upload_options():
    return "", 20


# Endpoint to view all transcriptions
@app.route("/transcriptions", methods=["GET"])
def get_transcriptions():
    return jsonify(transcriptions), 200


if __name__ == "__main__":
    os.makedirs("uploads", exist_ok=True)
    app.run(debug=True, port=5000)
