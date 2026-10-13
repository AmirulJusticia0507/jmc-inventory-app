# Dokumen Analisis Sistem & Arsitektur Software

**Aplikasi Pengelolaan Barang — PT JMC Indonesia**

---

## 1. Spesifikasi Tech Stack
* **Backend**: Node.js (Express.js / NestJS) + Prisma ORM / Sequelize
* **Frontend**: Vue.js 3 (Composition API + `<script setup>`), Vite, Pinia, Vue Router, Tailwind CSS
* **Database**: PostgreSQL
* **Authentication**: JWT (JSON Web Token)
* **File Storage**: Multer (Local Disk / Cloud Storage)
* **Excel Export**: `exceljs` / `xlsx`

---

## 2. Matriks Hak Akses (Role-Based Access Control)

| Modul / Fitur | Admin | Operator | Aturan Bisnis & Validasi Kunci |
| :--- | :---: | :---: | :--- |
| **Login / Auth** | ✅ | ✅ | Cek username/password & status `is_locked`. Jika `true`, login ditolak. |
| **Barang Masuk (Read & Filter)** | ✅ | ✅ | Pagination (10 item/page), Filter Kategori, Sub Kategori, Tahun, Search (Asal/Sub Kat), Sorting (Tanggal, Asal, Total). |
| **Barang Masuk (Create/Edit)** | ✅ | ✅ | **Admin**: Bisa memilih dropdown Operator.<br>**Operator**: Field Operator terkunci (*readonly/disabled*) ke akun sendiri.<br>**Validasi Total Harga**: Total seluruh item barang $\le$ `batas_harga` Sub Kategori. |
| **Cetak Surat Masuk** | ✅ | ✅ | Halaman Cetak / Export PDF Surat Masuk per transaksi. |
| **Toggle Verifikasi** | ✅ | ✅ | Toggle status verifikasi data (Icon Centang Hijau). |
| **Export Excel** | ✅ | ✅ | Download file `.xlsx` sesuai filter & query pencarian yang aktif. |
| **Master Data: Kategori** | ✅ | ❌ | CRUD Kategori (Modal Popup). Kode unik (max 10 char). |
| **Master Data: Sub Kategori**| ✅ | ❌ | CRUD Sub Kategori (Modal Popup). Memilih Kategori + Batas Harga (Masking Rupiah). |
| **Manajemen User** | ✅ | ❌ | CRUD User + Lock/Unlock. Validasi Password: 8-100 char, min. 1 huruf besar, 1 huruf kecil, 1 angka. |

---

## 3. Skema Database PostgreSQL

### 3.1 Tabel `users`
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Operator')),
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.2 Tabel `categories`
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.3 Tabel `sub_categories`
```sql
CREATE TABLE sub_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price_limit NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.4 Tabel `incoming_goods`
```sql
CREATE TABLE incoming_goods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    operator_id UUID NOT NULL REFERENCES users(id),
    category_id UUID NOT NULL REFERENCES categories(id),
    sub_category_id UUID NOT NULL REFERENCES sub_categories(id),
    source VARCHAR(200) NOT NULL,
    letter_number VARCHAR(100),
    attachment_path VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    grand_total NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.5 Tabel `incoming_good_items`
```sql
CREATE TABLE incoming_good_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incoming_good_id UUID NOT NULL REFERENCES incoming_goods(id) ON DELETE CASCADE,
    item_code VARCHAR(50) NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    price NUMERIC(15, 2) NOT NULL,
    quantity INT NOT NULL,
    unit VARCHAR(40) NOT NULL,
    total_price NUMERIC(15, 2) NOT NULL,
    expired_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Formula Logika Bisnis & Validasi

1. **Kalkulasi Total Item & Validasi Batas Harga Sub Kategori**:
   - Untuk setiap baris item $i$:
     $$\text{total\_price}_i = \text{price}_i \times \text{quantity}_i$$
   - Total keseluruhan transaksi:
     $$\text{Grand Total} = \sum_{i=1}^{n} \text{total\_price}_i$$
   - Syarat simpan data:
     $$\text{Grand Total} \le \text{SubCategory.price\_limit}$$
   - Jika $\text{Grand Total} > \text{SubCategory.price\_limit}$, backend melempar error status `422 Unprocessable Entity` ("Total harga barang melebihi batas harga sub kategori").

2. **Penguncian Operator saat Input**:
   - Jika JWT milik user ber-role `Operator`, endpoint API akan secara otomatis menimpa `operator_id` menggunakan ID dari token JWT demi alasan keamanan (mencegah *impersonation*).