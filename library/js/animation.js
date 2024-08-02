function playAudio() {
    var audio = document.getElementById('myAudio');
    audio.play().catch(function(error) {
        console.log('Autoplay prevented. User interaction required.');
    });
}

window.onload = playAudio