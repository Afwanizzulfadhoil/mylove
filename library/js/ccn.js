const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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