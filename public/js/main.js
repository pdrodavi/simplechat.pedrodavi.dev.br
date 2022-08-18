const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix:true
});

const socket = io();

socket.emit('joinRoom', {username, room});

socket.on('roomUsers', ({room ,users}) =>{
    outputRoomName(room);
    outputUsers(users);
})

socket.on('message', message => {
    console.log(message);
    
    let text = message.text;

    if (text.includes(' has joined the room')) {
        outputMessageBotJoin(message);
    } else if (text.includes(' has left the room')) {
        outputMessageBotLeave(message);
    } else if (message.username == 'BOT ') {
        outputMessageBot(message);
    } else {
        outputMessage(message);
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    socket.emit('chatMessage',msg);
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

})

function outputMessage(message){

    //console.log('user antes: '+ user)
    //console.log('user atual: '+ userActual)
    //console.log('strip atual: '+ strip)

    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>`;
    document.querySelector('.chat-messages').appendChild(div);

    /*
    let controle = false;

    if (userActual == user || user == '') {
        controle = true;
    }

    if(controle) {
        console.log('azul')
        const div = document.createElement('div');
        div.classList.add('message');
        div.innerHTML = `<p class="metauser">${message.username} <span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>`;
        document.querySelector('.chat-messages').appendChild(div);
    } else {
        console.log('verde')
        const div = document.createElement('div');
        div.classList.add('message');
        div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>`;
        document.querySelector('.chat-messages').appendChild(div);
    }*/

}

function outputMessageBot(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="metabot">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputMessageBotLeave(message){
    const div = document.createElement('div');
    div.classList.add('messageleave');
    div.innerHTML = `<p class="metabotleave">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputMessageBotJoin(message){
    const div = document.createElement('div');
    div.classList.add('messagejoin');
    div.innerHTML = `<p class="metabotjoin">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room){
    roomName.innerText = room;
}

function outputUsers(users) {
    userList.innerHTML = ` 
        ${ users.map(user => `<li>${user.username} &nbsp;<i style="width: 20%; color: green;" class="fas fa-circle"></i></li>`).join('') } 
    `;
}