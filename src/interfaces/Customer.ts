export interface dataPelanggan {
	nama: string;
	username: string;
	gender: string;
	phone: string;
	email: string;
	tanggal_lahir: string;
	alamat: {
		baris_1: string;
		baris_2: string;
		provinsi: string;
		kota: string;
		kodepos: string;
	};
	photo: string;
	photo_link: string;
	photo_id: string;
	photo_id_link: string;
	desc: string;
	user_id: string; // ini kalo terhubung dengan user yang bisa login sendiri
}
