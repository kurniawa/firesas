export interface dataPelanggan {
	nama: string;
	gender: string;
	phone: string;
	email: string;
	alamat: {
		baris_1: string;
		baris_2: string;
		provinsi: string;
		kota: string;
		kodepos: string;
	};
	photo: string;
	photo_link: string;
	desc: string;
}
