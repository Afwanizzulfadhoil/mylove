// Ganti dengan URL dan Anon Key dari Project Settings Supabase Anda
const SUPABASE_URL = 'https://vybghrduqgwyjjzjdish.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5YmdocmR1cWd3eWpqempkaXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4MTk1MTAsImV4cCI6MjEwODM5NTUxMH0.8rZUsqWi6hTNvQkUUSE0womYD-h56H43WtzobkkrLhs';
// Inisialisasi client menggunakan objek global window.supabase
const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.getElementById('cardForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.innerText = "Membuat Link...";
    btn.disabled = true;

    try {
        const { data, error } = await supabase
            .from('cards')
            .insert([
                {
                    nama: document.getElementById('nama').value,
                    pesan: document.getElementById('pesan').value,
                    foto_url: document.getElementById('fotoUrl').value,
                    musik: document.getElementById('pilihanMusik').value
                }
            ])
            .select();

        if (error) throw error;

        const cardId = data[0].id;
        const uniqueLink = window.location.origin + window.location.pathname.replace('index.html', '') + 'card.html?id=' + cardId;

        document.getElementById('generatedLink').value = uniqueLink;
        document.getElementById('resultBox').style.display = 'block';
        btn.innerText = "Berhasil Dibuat!";
    } catch (error) {
        console.error("Error inserting data: ", error);
        alert("Gagal membuat link, cek kembali konfigurasi Supabase Anda.");
        btn.innerText = "Buat Link Kartu";
        btn.disabled = false;
    }
});

const urlParams = new URLSearchParams(window.location.search);
const cardId = urlParams.get('id');

async function loadCardData() {
    if (!cardId) {
        document.getElementById('cardMessage').innerText = "Kartu tidak ditemukan!";
        return;
    }

    try {
        const { data, error } = await supabase
            .from('cards')
            .select('*')
            .eq('id', cardId)
            .single();

        if (error || !data) {
            document.getElementById('cardMessage').innerText = "Maaf, link kartu sudah tidak aktif atau salah.";
            return;
        }

        document.getElementById('cardMessage').innerText = data.pesan;
        document.getElementById('cardImage').src = data.foto_url;
        document.getElementById('myAudio').src = data.musik;
        document.getElementById('cardFooter').innerText = `Untuk: ${data.nama} ❤️`;

    } catch (error) {
        console.error("Error fetching card:", error);
        document.getElementById('cardMessage').innerText = "Terjadi kesalahan saat memuat kartu.";
    }
}

loadCardData();