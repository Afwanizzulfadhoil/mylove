function playAudio() {
    var audio = document.getElementById('myAudio');
    audio.playAudio = 'auto';
    audio.play().catch(function(error) {
        console.log('Autoplay prevented. User interaction required.');
    });
}


function ClickButton(){
    var btn = document.querySelector('.btn');

    if(btn){
        btn.style.display = 'none';
    }
    
}

window.onload = playAudio