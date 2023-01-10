import { admin_ids } from './../../auth/authStores';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './../../auth/firebase.config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Timestamp, getFirestore, collection, getDocs, setDoc, doc } from 'firebase/firestore';
import type { dataPerhiasan } from 'src/interfaces/Customer';
import {
	deleteObject,
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable
} from 'firebase/storage';

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);
const not_allowed_chars = '!`$%^&*()=[];/{}|:<>?';

export const stock_ats = [
	{
		doc_id: '71401101420002-1',
		berat: 1.2,
		jenis: 'jepit',
		kadar: 37.5,
		kategori: 'perhiasan',
		kode: '',
		mata: [{ jumlah: 1, warna: 'putih' }],
		nama: 'Anting Jepit mata putih-1 35% 1.2g',
		nama_short: 'AT Jp mp1 ku.35 n 1.2g',
		photo_file: '',
		photo_link: '',
		stok: 3,
		tipe_emas: 'kuning',
		tipe_perhiasan: 'at'
	}
];

export const stock_ccs = [
	{
		doc_id: '7210001420102-1',
		berat: 2.1,
		jenis: 'r.Polos',
		kadar: 42,
		kategori: 'perhiasan',
		kode: 's',
		nama: 'Cincin ring Polos 42% 2.1g',
		nama_short: 'Cc r.Pol ku.42 s 2.1g',
		photo_file: '',
		photo_link: '',
		stok: 5,
		tipe_emas: 'kuning',
		tipe_perhiasan: 'cc'
	}
];

export const tipe_perhiasan = [
	{
		doc_id: 'AT',
		jenis: [
			{ nama: 'Desy', short: 'Des' },
			{ nama: 'Desy Polos', short: 'DesP' },
			{ nama: 'Gipsy', short: 'Gip' },
			{ nama: 'Jepit', short: 'Jp' },
			{ nama: 'Jepit Polos', short: 'JpP' },
			{ nama: 'Kait', short: 'K' },
			{ nama: 'Kait Panjang', short: 'KPj' },
			{ nama: 'Kenip', short: 'Ken' },
			{ nama: 'Tusuk Sate', short: 'Tussat' }
		],
		kode: 1,
		nama: 'Anting'
	},
	{
		doc_id: 'GW',
		jenis: [
			{ nama: 'Desy', short: 'Des' },
			{ nama: 'Desy Polos', short: 'DesP' },
			{ nama: 'Gipsy', short: 'Gip' },
			{ nama: 'Jepit', short: 'Jp' },
			{ nama: 'Jepit Polos', short: 'JpP' },
			{ nama: 'Kait', short: 'K' },
			{ nama: 'Kait Panjang', short: 'KPj' },
			{ nama: 'Kenip', short: 'Ken' },
			{ nama: 'Tusuk Sate', short: 'Tussat' }
		],
		kode: 2,
		nama: 'Giwang'
	},
	{
		doc_id: 'CC',
		jenis: [
			{ nama: '1/2 Rante', short: '1/2R' },
			{ nama: '1/2 Pasir', short: '1/2P' },
			{ nama: 'Bambu Ukir', short: 'Bambuk' },
			{ nama: 'Dubai', short: 'Dub.' },
			{ nama: 'Listring Aurel', short: 'listr.Aurel' },
			{ nama: 'Listring V', short: 'listr.V' },
			{ nama: 'Patkok', short: 'Patk' },
			{ nama: 'Ring Polos', short: 'r.Pol' },
			{ nama: 'Stempel', short: 'Stp.' },
			{ nama: 'Wedding/Kawin', short: 'Wed' }
		],
		kode: 3,
		nama: 'Cincin'
	}
];

export function loopingTipePerhiasan() {
	tipe_perhiasan.forEach((element) => {
		migrateTipePerhiasan(element);
	});
}
export async function migrateTipePerhiasan(element: any) {
	await setDoc(doc(db, 'tipe_perhiasan', element.doc_id), {
		jenis: element.jenis,
		kode: element.kode,
		nama: element.nama
	});
}
