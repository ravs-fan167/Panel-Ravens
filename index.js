<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Ravs Store - Pesan Hosting</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-slate-900 text-slate-100">
  <nav class="p-4 bg-slate-800/60 backdrop-blur-lg">
    <div class="max-w-4xl mx-auto flex justify-between items-center">
      <h1 class="text-2xl font-bold">Ravs Store</h1>
      <div>Discord: <span id="discord-tag" class="font-medium">Loading...</span></div>
    </div>
  </nav>

  <main class="max-w-4xl mx-auto py-12 px-4">
    <section class="text-center mb-10">
      <h2 class="text-4xl font-bold mb-2">Hosting Murah & Cepat</h2>
      <p class="text-slate-300">SA:MP · Minecraft · Bot JS · VPS — pesan lewat form, admin akan menerima notifikasi di Discord.</p>
    </section>

    <section class="grid md:grid-cols-2 gap-6">
      <div class="bg-slate-800 p-6 rounded-2xl shadow">
        <h3 class="text-xl font-semibold mb-4">Pilih Paket</h3>
        <div class="space-y-3">
          <label class="block">
            <input type="radio" name="paket" value="samp" checked> SA:MP Hosting — Rp20.000/bln
          </label>
          <label class="block">
            <input type="radio" name="paket" value="mc"> Minecraft Hosting — Rp25.000/bln
          </label>
          <label class="block">
            <input type="radio" name="paket" value="bot"> Bot Discord — Rp15.000/bln
          </label>
        </div>
      </div>

      <form id="orderForm" class="bg-slate-800 p-6 rounded-2xl shadow space-y-4">
        <h3 class="text-xl font-semibold">Form Pemesanan</h3>

        <div>
          <label class="block text-sm text-slate-300">Nama</label>
          <input id="name" required class="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700" />
        </div>

        <div>
          <label class="block text-sm text-slate-300">Nomor WhatsApp</label>
          <input id="wa" placeholder="628xxxxxxxxxx" required class="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700" />
        </div>

        <div>
          <label class="block text-sm text-slate-300">Spesifikasi / Catatan</label>
          <textarea id="note" rows="4" class="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700"></textarea>
        </div>

        <div class="flex items-center gap-3">
          <button type="submit" class="bg-amber-400 text-slate-900 px-4 py-2 rounded font-semibold">Kirim Pesanan</button>
          <div id="status" class="text-sm text-slate-300"></div>
        </div>
      </form>
    </section>

    <section class="mt-10 text-slate-400 text-sm">
      <p>Setiap order akan mengirim notifikasi ke server Discord (channel admin) — pastikan admin bot sudah join ke server dan token di-setup.</p>
    </section>
  </main>

  <script>
    // ambil discord tag dari server (opsional)
    fetch('/api/meta')
      .then(r => r.json())
      .then(j => {
        document.getElementById('discord-tag').textContent = j?.botTag || 'Bot offline';
      })
      .catch(_=>{ document.getElementById('discord-tag').textContent = 'Tidak tersedia' });

    document.getElementById('orderForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const paket = document.querySelector('input[name="paket"]:checked').value;
      const name = document.getElementById('name').value.trim();
      const wa = document.getElementById('wa').value.trim();
      const note = document.getElementById('note').value.trim();

      const statusEl = document.getElementById('status');
      statusEl.textContent = 'Mengirim...';

      try {
        const res = await fetch('/api/order', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ paket, name, wa, note })
        });
        const json = await res.json();
        if (res.ok) {
          statusEl.textContent = 'Pesanan terkirim! Admin akan memproses.';
          // reset form
          document.getElementById('orderForm').reset();
        } else {
          statusEl.textContent = 'Gagal: ' + (json?.message || res.statusText);
        }
      } catch (err) {
        statusEl.textContent = 'Error koneksi.';
      }
    });
  </script>
</body>
</html>