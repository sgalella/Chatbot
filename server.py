import asyncio
import json
import os
import websockets
import time
from rasa.core.agent import Agent


async def chatbot(websocket, path):
    global conversation_counter
    response_communication = await websocket.recv()
    response = json.loads(response_communication)
    if response['type'] == "start":  # Wait until receiving start
        print(f'\nConversation: {conversation_counter}')
        while True:
            time.sleep(0.5)
            response_communication = await websocket.recv()
            response = json.loads(response_communication)
            output = await agent.handle_text(response['content'])
            intent = await agent.parse_message_using_nlu_interpreter(response['content'])
            print('Message:', intent['text'], '/ Intent:', intent['intent']['name'], sep=" ")
            request = dict()
            request['type'] = 'end' if intent['intent']['name'] == "goodbye" else'request'
            request['content'] = output[0]['text']
            request_communication = json.dumps(request)
            await websocket.send(request_communication)
            if request['type'] == 'end':
                conversation_counter += 1
                break
            else:
                continue


if __name__ == "__main__":
    IP = "localhost"
    PORT = "8765"
    TIMEOUT = 20
    conversation_counter = 1
    agent = Agent.load("models/current")
    os.system("clear")
    print("The agent is ready. Waiting for a message...", "Press Ctrl + C to close the server.", sep="\n")
    start_server = websockets.serve(chatbot, IP, PORT, ping_interval=TIMEOUT)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
