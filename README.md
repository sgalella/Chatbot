# Chatbot
Demo for conversational agent. The server side is written in python (using [rasa](https://rasa.com/)) and the client is written in javascript. The communication is handled by a websockets.

<p align="center">
    <img width="650" height="300" src="images/scheme.png">
</p>

To run the chatbot, open two different terminals and run the following commands:

```bash
# Terminal 1: Run the server
python server.py
```

```bash
# Terminal 2: Open the client
./client.sh
```

Browse the website given by the client. The chatbot includes speech recognition and text-to-speech.

<p align="center">
    <img width="500" height="500" src="images/chatbot.gif">
</p>

