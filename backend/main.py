import os
from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

# Set your OpenAI API key

# Array to store transcriptions
transcriptions = []

# Endpoint to handle MP3 upload and transcription
@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Save the uploaded file
    file_path = os.path.join('uploads', file.filename)
    file.save(file_path)

    # Transcribe the audio using OpenAI API
    with open(file_path, "rb") as audio_file:
        transcription = openai.Audio.transcribe("whisper-1", audio_file)

    # Save transcription to array
    transcriptions.append(transcription['text'])

    # Respond with transcription
    return jsonify({'transcription': transcription['text']}), 200

# Endpoint to view all transcriptions
@app.route('/transcriptions', methods=['GET'])
def get_transcriptions():
    return jsonify(transcriptions), 200

if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)
    app.run(debug=True)
