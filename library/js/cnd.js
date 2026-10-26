
(() => {
    if (window.__myloveCardAppInitialized) return;
    window.__myloveCardAppInitialized = true;

    const scriptUrl = document.currentScript.src;

    async function initializeSupabase() {
        const response = await fetch(new URL('env', scriptUrl));
        if (!response.ok) {
            throw new Error(`Tidak dapat membaca konfigurasi Supabase (${response.status}).`);
        }

        const envText = await response.text();
        const config = {};
        for (const line of envText.split(/\r?\n/)) {
            const match = line.match(/^\s*(SUPABASE_URL|SUPABASE_ANON_KEY)\s*=\s*(.*?)\s*;?\s*$/);
            if (match) {
                config[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
            }
        }

        if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
            throw new Error('SUPABASE_URL atau SUPABASE_ANON_KEY tidak ditemukan di .env.');
        }
        if (!window.supabase?.createClient) {
            throw new Error('Library Supabase gagal dimuat. Periksa koneksi internet atau CDN.');
        }

        const supabase = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
        initializeCardForm(supabase);

        if (document.getElementById('cardMessage')) {
            await loadCardData(supabase);
        }
    }

    function initializeCardForm(supabase) {
        const cardForm = document.getElementById('cardForm');
        if (!cardForm) return;

        cardForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const button = document.getElementById('submitBtn');
            button.innerText = 'Membuat Link...';
            button.disabled = true;

            try {
                const { data, error } = await supabase
                    .from('cards')
                    .insert({
                        jenis: document.getElementById('jenisCard').value,
                        nama: document.getElementById('nama').value,
                        pesan: document.getElementById('pesan').value,
                        foto_url: document.getElementById('fotoUrl').value,
                        pilihanMusik: document.getElementById('pilihanMusik').value
                    })
                    .select('id')
                    .single();

                if (error) throw error;
                if (!data?.id) throw new Error('Supabase tidak mengembalikan ID kartu.');

                const cardUrl = new URL('card.html', window.location.href);
                cardUrl.searchParams.set('id', data.id);
                document.getElementById('generatedLink').value = cardUrl.href;
                document.getElementById('resultBox').style.display = 'block';
                button.innerText = 'Berhasil Dibuat!';
            } catch (error) {
                console.error('Error inserting card:', error);
                alert(`Gagal membuat kartu: ${error.message || 'periksa konfigurasi dan kebijakan Supabase.'}`);
                button.innerText = 'Buat Link Kartu';
                button.disabled = false;
            }
        });
    }

    async function loadCardData(supabase) {
        const message = document.getElementById('cardMessage');
        const cardId = new URLSearchParams(window.location.search).get('id');
        if (!cardId) {
            message.innerText = 'Kartu tidak ditemukan!';
            return;
        }

        try {
            const { data, error } = await supabase
                .from('cards')
                .select('jenis, nama, pesan, foto_url, pilihanMusik') // Ambil kolom 'jenis' juga
                .eq('id', cardId)
                .single();

            if (error || !data) {
                message.innerText = 'Maaf, link kartu sudah tidak aktif atau salah.';
                return;
            }

            message.innerText = data.pesan;
            document.getElementById('cardImage').src = data.foto_url;
            document.getElementById('myAudio').src = data.pilihanMusik;
            document.getElementById('cardFooter').innerText = `Untuk: ${data.nama} ❤️`;

            // Ubah Judul Browser berdasarkan tema
            let judulTema = "Special Card";
            if (data.jenis === 'love') judulTema = "Love Card For";
            else if (data.jenis === 'hbd') judulTema = "Happy Birthday For";
            else if (data.jenis === 'wedding') judulTema = "Wedding Invitation For";

            document.getElementById('title').innerText = `${judulTema} ${data.nama}`;

            // (Opsional) Anda bisa memanggil fungsi kustomisasi tampilan di sini berdasarkan data.jenis
            const container = document.querySelector('.container');
            if (container) {
                // Menghapus kelas tema sebelumnya lalu menambahkan kelas tema baru
                container.classList.remove('theme-love', 'theme-hbd', 'theme-wedding');
                container.classList.add(`theme-${data.jenis}`);
            }
        } catch (error) {
            console.error('Error fetching card:', error);
            message.innerText = 'Terjadi kesalahan saat memuat kartu.';
        }
    }

    initializeSupabase().catch((error) => {
        console.error('Gagal menginisialisasi Supabase:', error);
        const message = document.getElementById('cardMessage');
        if (message) {
            message.innerText = 'Gagal membaca konfigurasi Supabase.';
        } else {
            alert(`Gagal memulai aplikasi: ${error.message}`);
        }
    });
})();