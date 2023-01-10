import type { Timestamp } from 'firebase/firestore';

export interface dataPelanggan {
	nama: string;
	username: string;
	gender: string;
	phone: string;
	email: string;
	tanggal_lahir: Timestamp;
	alamat: {
		baris_1: string;
		baris_2: string;
		provinsi: string;
		kota: string;
		kodepos: string;
		daerah: string;
	};
	photo: string;
	photo_link: string;
	photo_id: string;
	photo_id_link: string;
	desc: string;
	user_id: string; // ini kalo terhubung dengan user yang bisa login sendiri
}

export interface dataPerhiasan {
	doc_id: string;
	berat: number;
	jenis: string;
	kadar: number;
	kategori: string;
	kode: string;
	mata: [
		{
			warna: string;
			jumlah: number;
		}
	];
	nama: string;
	photo_file: string;
	photo_link: string;
	stok: number;
	tipe: string;
}
