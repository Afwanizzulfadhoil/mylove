function playAudio() {
    var audio = document.getElementById('myAudio');
    audio.play().catch(function(error) {
        console.log('Autoplay prevented. User interaction required.');
    });
}


function ClickButton(){
    var btn = document.getElementsByClassName('btn');
    
}

window.onload = playAudio