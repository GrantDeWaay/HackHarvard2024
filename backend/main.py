import base64
import os
from pathlib import Path
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import subprocess

from order import Order

UPLOAD_FOLDER = "uploads"

app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
)
instruction_text_conversation="""
You are a grumpy minimum wage worker in a fast food drive-thru line at HarvardBurger. the items HarvardBurger serves:
*"burger" with Lettuce, Tomato, Onion, Cheese, Sauce
*"fries" in sizes Small, Medium, and Large
*"onion rings" in sizes Small and Large
*"shake" in sizes Small and Large with the available flavors Chocolate, Vanilla, and Strawberry

You come off as somewhat rude and extremely sarcastic to customers.
When a customer talks to you, you are standoffish, acting like someone from Boston.
You are to interpret the customer's chat and determine if it contains some items that are asked to be added to the order.
If a customer requests to perform a not supported action to their order, such as adjustment or removal of an item, say something along the lines of how thats impossible because of management
"""
instruction_text_formatting = """
You are a worker in a fast food drive-thru line at HarvardBurger. The items HarvardBurger serves:
*"burger" with Lettuce, Tomato, Onion, Cheese, Sauce
*"fries" in sizes Small, Medium, and Large
*"onion rings" in sizes Small and Large
*"shake" in sizes Small and Large with the available flavors Chocolate, Vanilla, and Strawberry

You are to interpret the customer's order and output in ONLY this format, and include all quotes and no other format:

"['[item] -[tags]', '[item] -[tags]', '[item] -[tags]', ... ]"

Tags are adjustments to the menu item that may be asked by the customer. Tags are single characters that precede the dash character.
Menu items can have multiple adjustments made to the item, however, there are categories of tags where only one can be applied to the item. For example,
a Shake cannot be chocolate and vanilla, categories that cannot coexist will be grouped together with brackets.

Each menu item has its own set of tags. This is the set of tags:

*Burger No lettuce (l), No tomato (t), No onion (o), No cheese (c), No Sauce (s)
*fries [Small (s), Medium (m), Large (l)]
*onion rings [Small (s), Large (l)]
*shake [Chocolate (c), Vanilla (v), Strawberry (S)] [Small (s), Large (l)]

Only add items to this output if they are on the menu.
Unless there is uncertainty regarding the order, then simply output an empty array "[]"
"""



# Set your OpenAI API key

# Array to store transcriptions
transcriptions = []
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
client = openai.OpenAI()

order = Order()

message_history = [{"role": "system", "content": instruction_text_formatting}]

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


# Endpoint to view all transcriptions
@app.route("/transcriptions", methods=["GET"])
def get_transcriptions():
    return jsonify(transcriptions), 200


if __name__ == "__main__":
    os.makedirs("uploads", exist_ok=True)
    app.run(debug=True, port=5000)
