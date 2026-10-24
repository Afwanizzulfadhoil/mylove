function playAudio() {
    var audio = document.getElementById('myAudio');
    audio.play().catch(function(error) {
        console.log('Autoplay prevented. User interaction required:', error);
    });
}

function ClickButton() {
    // 1. Sembunyikan tombol BUKA
    var btn = document.querySelector('.button');
    if (btn) {
        btn.style.display = 'none';
    }

    // 2. Putar musik
    playAudio();

    // 3. Tampilkan container dengan efek slide
    var container = document.querySelector('.container');
    if (container) {
        container.classList.add('active');
    }
}