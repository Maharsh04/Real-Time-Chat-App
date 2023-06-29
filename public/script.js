const socket = io();

const chat = document.querySelector('.chat');
const sendButton = document.querySelector('.send');
const chatWindow = document.querySelector('.chat-window');

function appendMessage(message, username, picture, type) {
    console.log(picture);
    let msg = document.createElement('div');
    const contentDiv = document.createElement('p');
    contentDiv.innerHTML = message;
    const profileDiv = document.createElement('div');
    profileDiv.classList.add('profile');
    const profileContent = `
    <img src="${picture}" alt="User">
    <h6>${username}</h6>`;
    profileDiv.innerHTML = profileContent;
    msg.classList.add(type, 'message');

    if (type == 'incoming') {
        msg.appendChild(profileDiv);
        msg.appendChild(contentDiv);
    }
    else {
        msg.appendChild(contentDiv);
        msg.appendChild(profileDiv);
    }
    chatWindow.append(msg);
}
let myName,myPic;
socket.on('info',(name,picture)=>{
    myName=name;
    myPic=picture;
})

function sendMessage() {
    if (chat.value != "") {
        appendMessage(chat.value,myName,myPic,'outgoing')
        socket.emit('send', chat.value);
        chat.value = "";
    }
}

sendButton.addEventListener('click', (e) => {
    e.preventDefault();
    sendMessage();
});

chat.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

socket.on('userMessage', (message, username, picture) => {
    appendMessage(message, username, picture, 'incoming');
})







//----------------------------------Live-search-------------------------------------
const searchInput = document.querySelector(".search-participant input");
const noResultMessage = document.createElement("li");
noResultMessage.innerHTML = "No Result Found";
const searchParticipant = () => {
    let found = false;
    const input = searchInput.value.toLowerCase();
    const listItems = document.querySelectorAll(".participant-list ul li");

    listItems.forEach((item) => {
        let text = item.textContent;
        if (text.toLowerCase().includes(input)) {
            item.style.display = "";
            found = true;
        }
        else {
            item.style.display = "none";
        }
    });

    if (!found) {
        participantList.appendChild(noResultMessage);
    }
    else {
        participantList.removeChild(noResultMessage);
    }
};
searchInput.addEventListener('input', searchParticipant);


//-----------------------------------Search-participant----------------------------------

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchParticipant();
    }
});

// -----------------------------------Add-participant-------------------------------------
const participantList = document.querySelector(".participant-list ul");

function addParticipant() {
    const participantName = prompt("Enter participant name");
    if (participantName.length != 0) {
        const participantEntry = document.createElement("li");
        participantEntry.innerHTML = participantName;
        participantList.append(participantEntry);
    }
}



