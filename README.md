# IMT KRS Planner

MVP aplikasi perencanaan studi untuk mahasiswa Informatika. Aplikasi membantu membaca curriculum map, mengevaluasi prasyarat dan penawaran, menyusun simulasi KRS, memantau riwayat akademik, serta mengelola data kurikulum dari sisi admin.

## Teknologi

- Next.js 15 App Router, React 19, dan TypeScript
- Tailwind CSS untuk styling
- React Flow (`@xyflow/react`) untuk curriculum map
- PostgreSQL dan Prisma ORM
- Zod untuk validasi server-side yang akan digunakan pada route handler
- Vitest untuk unit test rules engine

## Menjalankan proyek

Prasyarat: Node.js 20+ dan PostgreSQL.

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

Buka `http://localhost:3000`. Antarmuka demo memakai seed lokal sehingga dapat dibuka tanpa database setelah dependency terpasang. Database disiapkan untuk tahap integrasi persistence berikutnya.

## Environment variables

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/imt_krs_planner?schema=public"
```

## Perintah

```bash
npm run dev          # development server
npm run build        # production build
npm test             # unit test
npm run db:generate  # generate Prisma Client
npm run db:migrate   # migration interaktif
npm run db:seed      # data awal kurikulum dan aturan SKS
```

## Akun demo

Autentikasi MVP disimulasikan melalui profil statis:

- Mahasiswa: `nadia@imt.ac.id` — Nadia Prameswari, AI Track
- Admin: `admin@imt.ac.id` — akses halaman pada menu Administrasi

Belum ada password atau SSO. Autentikasi nyata merupakan tahap selanjutnya.

## Deployment ke Vercel

Repository sudah menyediakan `vercel.json`, script `vercel-build`, generate Prisma saat instalasi/build, Node.js 20–22, dan binary SWC lintas platform yang terkunci di `package-lock.json`.

1. Import repository ke Vercel sebagai proyek Next.js.
2. Gunakan Build Command bawaan dari `vercel.json`: `npm run vercel-build`.
3. Jika persistence PostgreSQL diaktifkan, tambahkan `DATABASE_URL` pada Environment Variables untuk Production, Preview, dan Development.
4. Jalankan migration production dari pipeline atau terminal tepercaya: `npx prisma migrate deploy`.
5. Redeploy setelah environment variable tersedia.

Endpoint parser transkrip memakai Node.js runtime, memori 1 GB, durasi maksimal 30 detik, dan batas PDF 4 MB agar sesuai dengan batas request fungsi serverless Vercel.

## Struktur folder

```text
prisma/
  schema.prisma        Model data PostgreSQL
  seed.ts              Seed katalog dan aturan SKS
src/
  app/                 Route dan halaman App Router
    admin/             Halaman pengelolaan admin
    curriculum/        Curriculum map
    planner/           Simulasi KRS
    history/           Riwayat akademik
  components/          Shell, navigasi, dan komponen UI
  data/                Dataset demo terpusat
  lib/                 Types, konfigurasi warna, nilai, rules engine
```

## Arsitektur dan kondisi MVP

Rules engine tidak bergantung pada React dan mengembalikan `eligible`, `status`, `reasons`, serta `warnings`. Utility nilai dan konfigurasi warna didefinisikan satu kali. Prisma schema memiliki foreign key, unique constraint, index, timestamp, serta posisi node curriculum.

UI saat ini adalah prototype fungsional berbasis data demo: filter map, drawer detail, simulasi tambah/hapus KRS, pencarian katalog, validasi kode unik, dan pencegahan prerequisite sirkular berjalan di browser. Langkah integrasi berikutnya adalah mengganti data demo dengan repository Prisma melalui server actions/route handlers, menambah autentikasi, dan menyimpan draft ke PostgreSQL.

## Siklus impor transkrip

Mahasiswa membuka **Impor Transkrip**, memilih PDF maksimal 10 MB, lalu server memvalidasi signature PDF dan mengekstrak text layer. Parser membaca identitas, kode, nama, periode, SKS, nilai, serta IPK, kemudian mencocokkannya dengan master kurikulum. Baris yang tidak dikenal ditandai untuk pemetaan admin dan tidak dipilih otomatis. Setelah mahasiswa mengonfirmasi preview, hasil masuk ke riwayat akademik demo. Model `TranscriptImport` dan `TranscriptImportItem` disiapkan untuk audit, pencegahan impor duplikat berdasarkan hash, dan persistence transaksional di PostgreSQL.
