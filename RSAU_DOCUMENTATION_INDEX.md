# Index Dokumentasi RSAU TNI AU

## 📚 Dokumentasi Terkini (Latest - January 2024)

### ✅ CURRENT & OFFICIAL

1. **DAFTAR_23_RSAU_UPDATE.md** 🔴 **TERBARU**
   - Daftar lengkap 23 RSAU dengan nama resmi terbaru
   - Kategori berdasarkan tingkat (A, B, C)
   - Detail lokasi, Lanud, kapasitas, fasilitas
   - Status: ✅ CURRENT - Gunakan sebagai referensi utama

2. **RSAU_NAMES_UPDATE_SUMMARY.md** 🔴 **TERBARU**
   - Summary lengkap update nama RSAU (3 RSAU)
   - Perubahan detail dan dampak sistem
   - Testing checklist
   - Migration notes
   - Status: ✅ CURRENT - Summary keseluruhan perubahan

3. **RSAU_CHANGES_DETAIL.md** 🔴 **TERBARU**
   - Comparison table: Before vs After
   - Detail 3 perubahan nama RSAU
   - Verification checklist
   - Status: ✅ CURRENT - Detail teknis perubahan

---

## 📜 Dokumentasi Historis (Historical)

### ⚠️ HISTORICAL REFERENCE ONLY

4. **RSAU_UPDATE_SUMMARY.md** ⚠️ **OUTDATED**
   - Update RSAU sebelumnya (3 RSAU)
   - Nama yang tercantum: "dr. Siswondo Parman" dan "dr. M. Salamun"
   - Status: ⚠️ OUTDATED - Hanya untuk referensi historis
   - **Jangan gunakan** sebagai referensi nama RSAU

5. **DAFTAR_23_RSAU.md** (jika ada) ⚠️ **OUTDATED**
   - Versi lama daftar RSAU
   - Status: ⚠️ OUTDATED - Digantikan oleh DAFTAR_23_RSAU_UPDATE.md

---

## 🔄 Timeline Perubahan

### Update 1 (Historical - 2024 awal)
- File: RSAU_UPDATE_SUMMARY.md
- Perubahan: 3 RSAU (Esnawan, Salamun, Siswondo)
- Nama yang digunakan: "dr. M. Salamun", "dr. Siswondo Parman"

### Update 2 (Current - January 2024) 🔴 **LATEST**
- File: DAFTAR_23_RSAU_UPDATE.md, RSAU_NAMES_UPDATE_SUMMARY.md, RSAU_CHANGES_DETAIL.md
- Perubahan: 3 RSAU (nama resmi)
- Nama yang digunakan: "dr. Moch. Salamun", "dr. M. Munir Lanud Abdulrachman Saleh", "dr. Mohammad Moenir Lanud Abd(Baru)"
- **Status**: ✅ OFFICIAL - Sesuai data resmi TNI AU

---

## 📋 Quick Reference

### Daftar 23 RSAU (Versi Terkini)

**Tingkat A (4 RSAU):**
1. RSPAU dr. Suhardi Hardjolukito
2. RSAU dr. Esnawan Antariksa
3. **RSAU dr. Moch. Salamun** ⬅️ Update dari "dr. M. Salamun"
4. RSGM drg.R.Poerwanto

**Tingkat B (13 RSAU):**
5. RSAU dr. Hasan Toto Lanud Atang Sendjaja
6. RSAU dr. Efram Harsana Lanud Iswahjudi
7. RSAU dr. Dody Sardjoto Lanud Hasanuddin
8. RSAU dr. Siswanto Lanud Adi Soemarmo
9. **RSAU dr. M. Munir Lanud Abdulrachman Saleh** ⬅️ Update dari "dr. Siswondo Parman"
10. **RSAU dr. Mohammad Moenir  Lanud Abd(Baru)** ⬅️ Update dari "dr. Mohammad Moenir Lanud Abd"
11. RSAU dr. Sukirman Lanud Roesmin Nurjadin
12. RSAU dr. Mohammad Sutomo Lanud Supadio
13. RSAU dr. Abdul Malik Lanud Soewondo
14. RSAU Soemitro Lanud Surabaya
15. RS TNI AU Sjamsudin Noor
16. RSAU dr. Charles P. J. Suoth Lanud Sam Ratulangi
17. RSAU dr. Norman T. Lubis Lanud Sulaiman

**Tingkat C (6 RSAU):**
18. RSAU. dr. Yuniati Wisma Karyani Lanud R.Sadjad
19. RSAU  dr. Hoediono Lanud Suryadarma
20. Rumkit Lanud Dhomber
21. Rumkit Lanud Silas Papare
22. RSAU. dr. Kresno Lanud Manuhua, Biak
23. RSAU.Lanud Eltari

---

## 🎯 Panduan Penggunaan

### Untuk Developer:
✅ **Gunakan**: DAFTAR_23_RSAU_UPDATE.md, RSAU_NAMES_UPDATE_SUMMARY.md, RSAU_CHANGES_DETAIL.md  
❌ **Jangan gunakan**: RSAU_UPDATE_SUMMARY.md (outdated)

### Untuk Implementasi:
- Data source: `/src/mockDb.js` (lines 11-314)
- 3 RSAU telah diupdate dengan nama resmi
- ID tetap sama (rsau_1 sampai rsau_23)
- Structure tidak berubah - hanya field `nama`

### Untuk Testing:
- Clear localStorage untuk melihat perubahan
- Verifikasi nama di Dashboard PUSKESAU
- Test facility selector dengan nama baru

---

## 📝 Notes

1. **Nama Resmi**: Gunakan nama dari DAFTAR_23_RSAU_UPDATE.md sebagai referensi
2. **Dokumentasi Lama**: File dengan nama "RSAU_UPDATE_SUMMARY.md" adalah historis
3. **Single Source of Truth**: mockDb.js adalah source of truth untuk data RSAU
4. **Update Frequency**: Dokumen ini akan diupdate setiap ada perubahan nama RSAU

---

## 🔗 Related Documentation

- `/FRONT_OFFICE_MODULE.md` - Frontend module documentation
- `/BACKOFFICE_PELAYANAN_INFO_MODULES.md` - Backend module documentation
- `/GETTING_STARTED.md` - Setup and installation guide
- `/README.md` - Project overview

---

**Last Updated**: January 2024  
**Maintainer**: Development Team  
**Status**: ✅ CURRENT  

---

## ⚡ Quick Command

Untuk melihat daftar nama RSAU terkini di database:
```bash
cd /home/engine/project
grep -A 2 "id: 'rsau_" src/mockDb.js | grep "nama:" | head -23
```

Output:
```
nama: 'RSPAU dr. Suhardi Hardjolukito',
nama: 'RSAU dr. Esnawan Antariksa',
nama: 'RSAU dr. Moch. Salamun',
nama: 'RSGM drg.R.Poerwanto',
...
(dan seterusnya untuk 23 RSAU)
```
