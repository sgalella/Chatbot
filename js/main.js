// Define port for the connection
const PORT = 8765;

// Create websocket at the specified url (port: server)
var socket = new WebSocket("ws://localhost:" + PORT)

// Initialize speech synthesizer
const speechSynthesizer = new SpeechSynthesisUtterance();
speechSynthesizer.volume = 1;
speechSynthesizer.rate = 1;
speechSynthesizer.pitch = 1;

socket.onopen = function(){
    var msg = {
        type: "start",
        content: null
    }
    socket.send(JSON.stringify(msg));

    var current_time = new Date();
    var text_start = "Session started the " + 
    (current_time.getDate()<10?"0":"") + current_time.getDate() + "/" + 
    (current_time.getMonth()<10?"0":"") + (current_time.getMonth()) + "/" + 
    current_time.getFullYear() + " at " + 
    (current_time.getHours()<10?"0":"") + current_time.getHours() + ":" + 
    (current_time.getMinutes()<10?"0":"") + current_time.getMinutes() + ":" + 
    (current_time.getSeconds()<10?"0":"") + current_time.getSeconds()
    
    var start = document.createElement("div");
    start.setAttribute("class", "session_start");
    var text = document.createTextNode(text_start)
    start.appendChild(text)
    document.getElementById("messages").appendChild(start);
}

// Retrieve chatbot response from the server
socket.onmessage = function(event){

    var socket_msg = JSON.parse(event.data);

    var received_chats = document.createElement("div");
    received_chats.setAttribute("class", "received_chats");

    var received_chats_msg = document.createElement("div");
    received_chats_msg.setAttribute("class", "received-chats-msg");

    var received_msg_inbox = document.createElement("div");
    received_msg_inbox.setAttribute("class", "received-msg-inbox");

    var p = document.createElement("p");
    var text = document.createTextNode(socket_msg.content);
    p.appendChild(text);
    received_msg_inbox.appendChild(p);

    var current_time = new Date();
    var time_to_display = 
    (current_time.getHours()<10?"0":"") + current_time.getHours() + ":" + 
    (current_time.getMinutes()<10?"0":"") + current_time.getMinutes() + ":" + 
    (current_time.getSeconds()<10?"0":"") + current_time.getSeconds()

    var time = document.createElement("div");
    time.setAttribute("class", "time_received");
    var text = document.createTextNode(time_to_display);
    time.appendChild(text);

    received_chats_msg.appendChild(received_msg_inbox);
    received_chats_msg.appendChild(time);
    received_chats.appendChild(received_chats_msg);

    var image = document.createElement("img")
    image.setAttribute("class", "received-chats-img")
    image.src = "images/agent-profile.png"

    document.getElementById("messages").appendChild(image);
    document.getElementById("messages").appendChild(received_chats);
    document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;

    // If session ends, close the connection
    if (socket_msg.type == "end")
    {
        var current_time = new Date();
        var text_end = "Session ended the " + 
        (current_time.getDate()<10?"0":"") + current_time.getDate() + "/" + 
        (current_time.getMonth()<10?"0":"") + (current_time.getMonth()) + "/" + 
        current_time.getFullYear() + " at " + 
        (current_time.getHours()<10?"0":"") + current_time.getHours() + ":" + 
        (current_time.getMinutes()<10?"0":"") + current_time.getMinutes() + ":" + 
        (current_time.getSeconds()<10?"0":"") + current_time.getSeconds()

        var end = document.createElement("div");
        end.setAttribute("class", "session_end");
        var text = document.createTextNode(text_end)
        end.appendChild(text)
        document.getElementById("messages").appendChild(end);

        document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;

        socket.close()
    }

    // If the volume button is ON, the agent speaks
    if (document.getElementById("speech").classList == "fa fa-volume-mute"){
        speechSynthesizer.text = socket_msg.content
        speechSynthesis.speak(speechSynthesizer);
    }
}

// Collect the query from the textbox and send it to the server
function sendMessage(){

    var content = document.getElementById("textBox").value;
    var msg = {
        type: "request",
        content: content
    }

    if (msg.content) {

        socket.send(JSON.stringify(msg));

        var outgoing_chats = document.createElement("div");
        outgoing_chats.setAttribute("class", "outgoing_chats");
    
        var outgoing_chats_msg = document.createElement("div");
        outgoing_chats_msg.setAttribute("class", "outgoing-chats-msg");
    
        var outgoing_msg_inbox = document.createElement("div");
        outgoing_msg_inbox.setAttribute("class", "outgoing-msg-inbox");
    
        var p = document.createElement("p");
        var text = document.createTextNode(msg.content);
        p.appendChild(text);
        outgoing_msg_inbox.appendChild(p);
        
        var current_time = new Date();
        var time_to_display = 
        (current_time.getHours()<10?"0":"") + current_time.getHours() + ":" + 
        (current_time.getMinutes()<10?"0":"") + current_time.getMinutes() + ":" + 
        (current_time.getSeconds()<10?"0":"") + current_time.getSeconds()
    
        var time = document.createElement("div");
        time.setAttribute("class", "time_outgoing");
        var text = document.createTextNode(time_to_display);
        time.appendChild(text);

        var image = document.createElement("img")
        image.setAttribute("class", "outgoing-chats-img")
        image.src = "images/user-profile.png"

        outgoing_chats_msg.appendChild(outgoing_msg_inbox);
        outgoing_chats_msg.appendChild(time);
        outgoing_chats.appendChild(outgoing_chats_msg);

        document.getElementById("messages").appendChild(image);
        document.getElementById("messages").appendChild(outgoing_chats);

        // Reset textbox content to empty
        document.getElementById("textBox").value = "";
    
        // Autoscroll
        document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
    }
}

// Check status of the connection (online - offline) with a delay of 0.5 seconds
window.setInterval(function(){

    if (!document.getElementById("online") && !document.getElementById("offline")){
        var status = document.createElement("div");
        status.id = "status";
        var circle = document.createElement("i");
        circle.setAttribute("class", "fa fa-circle");
        circle.id = "offline";
        var h6 = document.createElement("h6");
        var text_offline = document.createTextNode("offline");
        h6.appendChild(text_offline);
        status.appendChild(circle);
        status.appendChild(h6);
        document.getElementById("header-info").appendChild(status)
    }
    else if (socket.readyState == WebSocket.OPEN && document.getElementById("offline")){
        document.getElementById("status").remove()
        var status = document.createElement("div");
        status.id = "status";
        var circle = document.createElement("i");
        circle.setAttribute("class", "fa fa-circle");
        circle.id = "online";
        var h6 = document.createElement("h6");
        var text_online = document.createTextNode("online");
        h6.appendChild(text_online);
        status.appendChild(circle);
        status.appendChild(h6);  
        document.getElementById("header-info").appendChild(status)
} 
    else if (socket.readyState == WebSocket.CLOSED && document.getElementById("online")){
        document.getElementById("status").remove()

        var status = document.createElement("div");
        status.id = "status";

        var circle = document.createElement("i");
        circle.setAttribute("class", "fa fa-circle");
        circle.id = "offline";

        var h6 = document.createElement("h6");
        var text_offline = document.createTextNode("offline");
        h6.appendChild(text_offline);
        status.appendChild(circle);
        status.appendChild(h6);
        document.getElementById("header-info").appendChild(status)
}
}, 500);

// Shortcuts for different buttons in the screen
document.getElementById("textBox").addEventListener("keyup", function(event){
    event.preventDefault();
    if (event.keyCode == 13){
        document.getElementById("sendButton").click()
    }
})

// Activates or deactivates the speech synthesizer
function activateSpeech () {
    if (document.getElementById("speech").classList == "fa fa-volume-mute"){
        document.getElementById("speech").classList = "fa fa-volume-up"
    }
    else if (document.getElementById("speech").classList == "fa fa-volume-up"){
        document.getElementById("speech").classList = "fa fa-volume-mute"
    }
    
}

// Speech recognition
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;

var grammar = "#JSGF V1.0;"

var recognition = new SpeechRecognition();
var speechRecognitionGrammarList = new SpeechGrammarList;
speechRecognitionGrammarList.addFromString(grammar, 1);

recognition.grammars = speechRecognitionGrammarList;
recognition.lang = "en-US";
recognition.interimResults = false;

var listening = false;

recognition.onresult = function(){
    var last = event.results.length - 1;
    var command = event.results[last][0].transcript;
    var textBox = document.getElementById("textBox");
    textBox.value = command.charAt(0).toUpperCase() + command.substring(1);
}

recognition.onspeechend = function (){
    recognition.stop();
    listening = false
    textBox.value = ""
    textBox.placeholder = "Write down your message and press ENTER..."
    document.getElementById("microphone").classList = "fa fa-microphone"
    
}

recognition.onerror = function (){
    textBox.value = ""
    textBox.placeholder = "Write down your message and press ENTER..."
    alert("Error while listening!. Please try again.");
}

function recordMessage(){
    if (listening === true){
        recognition.onspeechend()
    }
    else if (listening === false){
        document.getElementById("microphone").classList = "fa fa-microphone-slash"
        recognition.start()
        listening = true
        var textBox = document.getElementById("textBox");
        textBox.value = ""
        textBox.placeholder = "Listening..."
    }
}