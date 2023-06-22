const socket = io();

const chat = document.querySelector('.chat');
const sendButton = document.querySelector('.send');
const chatWindow = document.querySelector('.chat-window');

function appendMessage(message,username,picture, type) {
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

function sendMessage() {
    if (chat.value != "") {
        appendMessage(chat.value, 'outgoing');
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

socket.on('userMessage', (message,username,picture) => {
    appendMessage(message,username,picture, 'incoming');
})







//----------------------------------Live-search-------------------------------------
const searchInput = document.querySelector(".search-group input");
const noResultMessage = document.createElement("li");
noResultMessage.innerHTML = "No Result Found";
const searchGroup = () => {
    let found = false;
    const input = searchInput.value.toLowerCase();
    const listItems = document.querySelectorAll(".group-list ul li");

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
        groupList.appendChild(noResultMessage);
    }
    else {
        groupList.removeChild(noResultMessage);
    }
};
searchInput.addEventListener('input', searchGroup);


//-----------------------------------Search-group----------------------------------

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchGroup();
    }
});

// -----------------------------------Add-Group-------------------------------------
const groupList = document.querySelector(".group-list ul");

function addGroup() {
    const groupName = prompt("Enter group name");
    if (groupName.length != 0) {
        const groupEntry = document.createElement("li");
        groupEntry.innerHTML = groupName;
        groupList.append(groupEntry);
    }
}



