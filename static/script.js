document.addEventListener('DOMContentLoaded', (function () {
    const socketIO = io();

    const usernameElem = document.getElementById('message');
    const submitButton = document.getElementById('login_button');
    const logOutButton = document.getElementById('log-out_button');
    const chatMessageInput = document.getElementById('chat-message'); // Ändrade felstavning
    const sendButton = document.getElementById('send');
    const login = document.getElementById('login');
    const chat = document.getElementById('chat');
    const chatArea = document.getElementById('chat-area');
    const typingElem = document.getElementById('typing-message');

    function showChat() {
        login.classList.add('hidden');
        chat.classList.remove('hidden');
    }

    function showLogin() {
        chat.classList.add('hidden');
        login.classList.remove('hidden');
    }

    function addTypingMessage(username) {
        typingElem.innerHTML = `${username} is typing...`;
    }

    function removeTypingMessage() {
        setTimeout(() => {
            typingElem.innerHTML = '';
        }, 2000);
    }

    function addChatMessage(message) {
        const chatMessage = document.createElement('p');
        chatMessage.innerHTML = message;
        chatArea.appendChild(chatMessage);
    }

    function resetInput() {
        chatMessageInput.value = '';
    }

    submitButton.addEventListener('click', () => {
        const username = usernameElem.value.trim();
        if (username) {
            socketIO.emit('join', username);
            showChat();
        } else {
            alert('Please enter a username.');
        }
    });

    sendButton.addEventListener('click', () => {
        const message = chatMessageInput.value.trim();
        if (message) {
            socketIO.emit('new message', message);
            resetInput();
        } else {
            alert('Please enter a message.');
        }
    });

    chatMessageInput.addEventListener('keydown', () => {
        socketIO.emit('typing');
    });

    chatMessageInput.addEventListener('keyup', () => {
        socketIO.emit('stop typing');
    });

    logOutButton.addEventListener('click', () => {
        usernameElem.value = '';
        showLogin();
    });

    socketIO.on('user joined', (username) => {
        addChatMessage(`${username} joined the chat`);
    });

    socketIO.on('send message', (message) => {
        addChatMessage(message);
    });

    socketIO.on('is typing', (username) => {
        addTypingMessage(username);
    });

    socketIO.on('not typing', () => {
        removeTypingMessage();
    });
})());
