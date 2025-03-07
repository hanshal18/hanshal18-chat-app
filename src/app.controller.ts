import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  renderChat(@Res() res: Response) {
    res.send(`
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat APP</title>
    <script src="/socket.io/socket.io.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #0a0a0a;
            background-image: radial-gradient(circle, rgba(0, 153, 255, 0.2), rgba(0, 0, 0, 1));
            color: white;
        }

        /* Chat Container */
        .chat-container {
            width: 90vh;
            /* Makes chat box width 90% of the viewport height */
            max-width: 600px;
            /* Prevents it from being too large on wide screens */
            padding: 20px;
            background: rgba(20, 20, 30, 0.6);
            border-radius: 20px;
            box-shadow: 0 0 15px rgba(0, 153, 255, 0.4);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 153, 255, 0.3);
            text-align: center;
            animation: fadeIn 1s ease-in-out;
            display: flex;
            flex-direction: column;
        }

        h2 {
            font-size: 24px;
            margin-bottom: 15px;
            text-shadow: 0px 0px 8px rgba(0, 153, 255, 0.8);
            animation: glow 1.5s infinite alternate;
        }

        input,
        button {
            width: 100%;
            padding: 12px;
            margin: 10px 0;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            outline: none;
            transition: 0.3s ease-in-out;
        }

        input {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            text-align: center;
            border: 1px solid rgba(0, 153, 255, 0.3);
            box-shadow: 0 0 8px rgba(0, 153, 255, 0.3);
        }

        input:focus {
            border-color: rgba(0, 153, 255, 0.8);
            box-shadow: 0 0 12px rgba(0, 153, 255, 0.6);
            transform: scale(1.02);
        }

        button {
            background: linear-gradient(135deg, #0099ff, #0033ff);
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
            box-shadow: 0 4px 10px rgba(0, 153, 255, 0.4);
        }

        button:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0, 153, 255, 0.6);
        }

        /* Messages Container */
        .messages {
            width: 100%;
            height: 50vh;
            /* Keeps messages area balanced inside the chat box */
            min-height: 200px;
            max-height: 60vh;
            overflow: auto;
            /* Enables scrolling when messages overflow */
            padding: 10px;
            margin-top: 10px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            backdrop-filter: blur(8px);
            display: flex;
            flex-direction: column;
            /* Stacks messages */
            gap: 10px;
            scroll-behavior: smooth;
            /* Smooth scrolling effect */
        }

        /* General Message Styling */
        .message {
            padding: 12px;
            border-radius: 12px;
            max-width: 80%;
            font-weight: bold;
            animation: popUp 0.5s ease-out;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        /* Sent Messages (User's Own) */
        .sent {
            align-self: center;
            /* Centered like requested */
            background: linear-gradient(135deg, #0099ff, #0033ff);
            color: white;
            box-shadow: 0 0 10px rgba(0, 153, 255, 0.6);
        }

        /* Received Messages */
        .received {
            align-self: center;
            /* Centered like requested */
            background: rgba(20, 20, 30, 0.6);
            color: white;
            border: 1px solid rgba(0, 153, 255, 0.3);
            box-shadow: 0 0 12px rgba(0, 153, 255, 0.5);
            backdrop-filter: blur(12px);
            width: 90%;
            text-align: left;
            /* Align text properly */
        }

        /* Username Styling */
        .username {
            font-size: 12px;
            color: #ddd;
            font-weight: bold;
            text-align: left;
            margin-bottom: 5px;
        }

        /* Animations */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }

            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes popUp {
            from {
                transform: scale(0.95);
                opacity: 0;
            }

            to {
                transform: scale(1);
                opacity: 1;
            }
        }

        @keyframes glow {
            from {
                text-shadow: 0px 0px 8px rgba(0, 153, 255, 0.8);
            }

            to {
                text-shadow: 0px 0px 15px rgba(0, 153, 255, 1);
            }
        }
    </style>
</head>

<body>
    <div class="chat-container">
        <h2>hanshal18 Chat APP</h2>
        <p><a href="https://github.com/hanshal18/hanshal18-chat-app" target="_blank" rel="noopener noreferrer">source
                code </a>
        </p>
        <input type="text" id="username" placeholder="Enter username">
        <button onclick="joinRoom()">Join Chat</button>
        <div class="messages" id="messages"></div>
        <input type="text" id="message" placeholder="Type your message">
        <button onclick="sendMessage()">Send</button>
    </div>
    <script>
        const socket = io();
        function joinRoom() {
            const username = document.getElementById('username').value;
            if (!username) return alert("Please enter a username.");
            socket.emit('joinRoom', { username });
        }
        function sendMessage() {
            const message = document.getElementById('message').value;
            const sender = document.getElementById('username').value;
            if (!message || !sender) return alert("Enter username and message.");
            socket.emit('sendMessage', { sender, message });
            document.getElementById('message').value = '';
        }
        socket.on('receiveMessage', (data) => {
            const li = document.createElement('div');
            li.classList.add('message', 'received');
            li.innerHTML = '<div class="username">' + data.sender + '</div>' + data.message;
            document.getElementById('messages').appendChild(li);
        });
        socket.on('userJoined', (data) => {
            const li = document.createElement('div');
            li.innerText = '🚀 ' + data.username + ' joined the chat!';
            document.getElementById('messages').appendChild(li);
        });
    </script>
</body>

</html> 
      `);
  }
}
