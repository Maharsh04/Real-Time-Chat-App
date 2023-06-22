const file=document.querySelector('#file');
const profile=document.querySelector('.profile-picture img');
const username=document.querySelector('.username');
let profilepic='/img/default.png';
file.addEventListener('change',(e)=>{

    const selectedFile= e.target.files[0];
    if(selectedFile){

        const reader=new FileReader();
        reader.addEventListener('load',()=>{
            profile.setAttribute('src', reader.result);
            profilepic=reader.result;
        })

        reader.readAsDataURL(selectedFile);
    }
})


const joinChat=document.querySelector('.join-chat');
joinChat.addEventListener('click',()=>{
    if(username.value!=''){
        window.location.href='/chat';
        socket.emit('userinfo',username.value,profilepic);
    }
    else{
        alert('Please enter username');
    }

})