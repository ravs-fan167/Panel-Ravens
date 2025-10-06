// app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID; // tempat admin menerima order
const PORT = process.env.PORT || 3000;

if (!DISCORD_TOKEN || !DISCORD_CHANNEL_ID) {
  console.warn('Peringatan: DISCORD_TOKEN atau DISCORD_CHANNEL_ID belum di-set. Bot tidak akan jalan penuh.');
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// metadata endpoint kecil (untuk menampilkan status bot di UI)
app.get('/api/meta', (req, res) => {
  if (client && client.user) {
    return res.json({ botTag: client.user.tag, status: 'online' });
  } else {
    return res.json({ botTag: null, status: 'offline' });
  }
});

// endpoint order
app.post('/api/order', async (req, res) => {
  const { paket, name, wa, note } = req.body || {};
  if (!paket || !name || !wa) return res.status(400).json({ message: 'paket, name, wa wajib diisi' });

  // buat object order
  const order = {
    paket, name, wa, note: note || '',
    timestamp: new Date().toISOString()
  };

  // kirim notifikasi ke Discord channel via bot (jika online)
  try {
    if (!DISCORD_TOKEN || !DISCORD_CHANNEL_ID) {
      console.warn('DISCORD env not set — skipping discord notify');
    } else if (!client || !client.isReady?.()) {
      // client.ready? gunakan client.uptime sebagai indikator
      if (!client || !client.uptime) {
        console.warn('Bot belum siap — akan tetap menerima order tapi belum mengirim ke Discord.');
      }
    }

    // attempt to send embed message when client ready
    if (client && client.user && client.channels) {
      const channel = await client.channels.fetch(DISCORD_CHANNEL_ID).catch(()=>null);
      if (channel) {
        const embed = new EmbedBuilder()
          .setTitle('📥 Pesanan Baru')
          .addFields(
            { name: 'Paket', value: String(order.paket), inline: true },
            { name: 'Nama', value: String(order.name), inline: true },
            { name: 'WA', value: String(order.wa), inline: true },
            { name: 'Waktu', value: new Date(order.timestamp).toLocaleString('id-ID') }
          )
          .setDescription(order.note || '-')
          .setColor(0x00AE86);
        await channel.send({ embeds: [embed] });
      } else {
        console.warn('Gagal fetch channel. Periksa DISCORD_CHANNEL_ID dan apakah bot ada di server tersebut.');
      }
    }

    // TODO: simpan order ke database/file jika perlu
    // contoh sederhana: simpan ke file / array (ini hanya demo)
    // fs.appendFileSync('orders.json', JSON.stringify(order) + '\n');

    return res.json({ ok: true, order });
  } catch (err) {
    console.error('Error saat mengirim order ke Discord:', err);
    return res.status(500).json({ message: 'Gagal mengirim notifikasi' });
  }
});

app.listen(PORT, () => {
  console.log(`Web server berjalan: http://localhost:${PORT}`);
});

// Discord bot login
if (DISCORD_TOKEN) {
  client.once('ready', () => {
    console.log(`Discord: logged in as ${client.user.tag}`);
  });

  client.on('messageCreate', (msg) => {
    // contoh: admin dapat menanyakan: !orders (kamu bisa implementasi)
    if (!msg.guild) return;
    if (msg.content === '!ping') {
      msg.reply('Pong! Bot menerima perintah.');
    }
  });

  client.login(DISCORD_TOKEN).catch(err => {
    console.error('Gagal login Discord bot:', err);
  });
} else {
  console.log('DISCORD_TOKEN tidak diatur — bot tidak akan login.');
}