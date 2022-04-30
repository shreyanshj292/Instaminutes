const socket = io('https://localhost:3000')
const messageVal = document.getElementById("message_input")
const messageForm = document.getElementById("send_box")
const messageBox = document.getElementById("message-container")
const userNameBox = document.getElementById("user-name-box")
const logoutBtn = document.getElementById("logout-btn")
const userList = document.getElementById("user-list")


const user = prompt("Who do we have here?")    // Uncomment this line while testing
addHostName(user)

socket.emit('new-user', user)              // change shreyanh to user while testing


const users = {}

socket.on('chat-message', data => {
    // console.log(data)
    changeMessage(`${data.user}: ${data.message}`)
})

socket.on('new_user', data => {
    // console.log(data.users)
    changeMessage(`${data.user} joined`)
    listUsers(data.users)
})

socket.on('user-disconnected', data => {
    // console.log(data)
    changeMessage(`${data.user_disconnected} disconnected`)
    listUsers(data.users)
})

messageForm.addEventListener('submit', a => {
    a.preventDefault()
    const message = messageVal.value
    changeMessage(`You: ${message}`)
    socket.emit("send-message", message)
    messageVal.value = ""
})


function changeMessage(message){
    const node = document.createElement("p")
    const textnode = document.createTextNode(message)
    node.appendChild(textnode);
    // messagebox.innerText = message;
    // console.log(node)
    var html = messageBox.innerHTML;
    console.log(html)
    messageBox.innerHTML = html + `<p> ${message} </p>`;
    messageBox.scrollTop = messageBox.scrollHeight
    // messageBox.append(node)
    // document.querySelector('#message-container').append(node);
}


function addHostName(message){
    console.log(`You: ${message} joined`);
    userNameBox.innerText = message
    // var li = document.createElement('li');
    // li.appendChild(document.createTextNode(message));
    // userList.appendChild(li);
}


function listUsers(u){
    console.log("I am in list users")
    userList.innerHTML = ""
    for (let i = 0; i < Object.values(u).length; i++) {
        const element = Object.values(u)[i];
        console.log(element)
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(element));
        userList.appendChild(li);
    }
}



logoutBtn.addEventListener('click', a => {
    console.log("Logging out")
    location.reload();

})