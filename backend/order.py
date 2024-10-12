import ast
import os
import base64
from flask import json, jsonify
import openai
from burger import Burger
from fries import Fries
from onion_rings import Onion_Rings
from shake import Shake

# Set OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")
client = openai.OpenAI()

# Instruction text for formatting and conversation
instruction_text_formatting = """
You are a worker in a fast food drive-thru line at HarvardBurger. The items HarvardBurger serves:
*"burger" with Lettuce, Tomato, Onion, Cheese, Sauce
*"fries" in sizes Small, Medium, and Large
*"onion rings" in sizes Small and Large
*"shake" in sizes Small and Large with the available flavors Chocolate, Vanilla, and Strawberry

You are to interpret the customer's order and output in ONLY this format, and include all quotes and no other format:

["[item] -[tags]", "[item] -[tags]", "[item] -[tags]", ... ]

Tags are adjustments to the menu item that may be asked by the customer. Tags are single characters that precede the dash character.
Menu items can have multiple adjustments made to the item, however, there are categories of tags where only one can be applied to the item. For example,
a Shake cannot be chocolate and vanilla, categories that cannot coexist will be grouped together with brackets.

Each menu item has its own set of tags. This is the set of tags:

*Burger No lettuce (l), No tomato (t), No onion (o), No cheese (c), No Sauce (s)
*fries [Small (s), Medium (m), Large (l)]
*onion rings [Small (s), Large (l)]
*shake [Chocolate (c), Vanilla (v), Strawberry (S)] [Small (s), Large (l)]

Only add items to this output if they are on the menu.
Unless there is uncertainty regarding the order, then simply output an empty array []
"""

instruction_text_conversation = """
You are a grumpy minimum wage worker in a fast food drive-thru line at HarvardBurger. the items HarvardBurger serves:
*"burger" with Lettuce, Tomato, Onion, Cheese, Sauce
*"fries" in sizes Small, Medium, and Large
*"onion rings" in sizes Small and Large
*"shake" in sizes Small and Large with the available flavors Chocolate, Vanilla, and Strawberry

You come off as somewhat rude and extremely sarcastic to customers.
When a customer talks to you, you are standoffish, acting like someone from Boston.
You are to interpret the customer's chat and determine if it contains some items that are asked to be added to the order.
If a customer requests to perform a not supported action to their order, such as adjustment or removal of an item, say something along the lines of how that's impossible because of management.
"""

class Order:
    def __init__(self):
        self.message_history = [{"role": "system", "content": instruction_text_conversation}]
        self.items = []

    def add_to_order(self, specs):
        print([str(item) for item in specs])
        for item in specs:
            if "burger" in item:
                self.items.append(Burger(item[6:]))
            elif "shake" in item:
                self.items.append(Shake(item[5:]))
            elif "fries" in item:
                print("is this reaching?")
                self.items.append(Fries(item[5:]))
            elif "onion rings" in item:
                self.items.append(Onion_Rings(item[11:]))
        for x in range(len(self.items)):
            print(x)

    def conversation(self, user_input):
        # Append user input to message history
        self.message_history.append({
            "role": "user",
            "content": [{"type": "text", "text": user_input}]
        })

        # Generate response from fast food worker
        completion_fast_food_worker = client.chat.completions.create(
            model="gpt-4o",
            messages=self.message_history
        )

        # Generate ordered food response
        completion_data_ordered_food = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": instruction_text_formatting},
                {"role": "user", "content": user_input}
            ]
        )
        # Update order based on completion data
        
        print("RIGHT HERE ::::::::::"+ completion_data_ordered_food.choices[0].message.content + " user input: " + user_input)
        print(json.loads(completion_data_ordered_food.choices[0].message.content))
        self.add_to_order(json.loads(completion_data_ordered_food.choices[0].message.content))

        # Generate speech audio response
        response = client.audio.speech.create(
            model="tts-1",
            voice="alloy",
            input=completion_fast_food_worker.choices[0].message.content,
        )
        response.stream_to_file("speech.wav")

        # Convert audio file to base64
        with open('speech.wav', 'rb') as audio_file:
            audio_data = audio_file.read()
            audio_base64 = base64.b64encode(audio_data).decode('utf-8')

        return jsonify({"transcription": user_input, "audio_base64": audio_base64, "menu_items": [str(item) for item in self.items]}), 200
def convert_string_to_array(string_array):
    try:
        # Try to parse as JSON first
        return json.loads(string_array)
    except json.JSONDecodeError:
        # Fallback to ast.literal_eval
        return ast.literal_eval(string_array)