function playAudio() {
    var audio = document.getElementById('myAudio');
    audio.play().catch(function (error) {
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

const card = document.getElementById('myCard');
const form = document.getElementById('cardForm');
const submitBtn = document.getElementById('submitBtn');

// Animasi ketika tombol submit diklik
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Mencegah reload halaman sementara untuk testing

    // Tambahkan kelas animasi CSS
    card.classList.add('animate-bounce');

    // Hapus kembali kelas setelah animasi selesai (600ms)
    setTimeout(() => {
        card.classList.remove('animate-bounce');
    }, 600);

    // Simulasi hasil link muncul (Nanti bisa dihubungkan ke file library/js/cnd.js & animation.js)
    document.getElementById('resultBox').style.display = 'block';
    document.getElementById('generatedLink').value = window.location.origin;
});