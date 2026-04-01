const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('public'));

// Database sementara (in-memory)
let pasien = [];
let nextId = 1;

// READ - Ambil semua pasien
app.get('/api/pasien', (req, res) => {
  res.json(pasien);
});

// CREATE - Tambah pasien baru
app.post('/api/pasien', (req, res) => {
  const { nama, umur, diagnosa } = req.body;
  if (!nama || !umur || !diagnosa) {
    return res.status(400).json({ error: 'Semua field wajib diisi' });
  }
  const dataBaru = { id: nextId++, nama, umur, diagnosa };
  pasien.push(dataBaru);
  res.status(201).json(dataBaru);
});

// UPDATE - Edit data pasien
app.put('/api/pasien/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = pasien.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Pasien tidak ditemukan' });

  const { nama, umur, diagnosa } = req.body;
  pasien[index] = { id, nama, umur, diagnosa };
  res.json(pasien[index]);
});

// DELETE - Hapus pasien
app.delete('/api/pasien/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = pasien.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Pasien tidak ditemukan' });

  pasien.splice(index, 1);
  res.json({ message: 'Pasien berhasil dihapus' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});