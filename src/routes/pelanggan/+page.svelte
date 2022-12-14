<script lang="ts">
	import { initializeApp } from 'firebase/app';
	import { getFirestore } from 'firebase/firestore';
	import { firebaseConfig } from './../../auth/firebase.config';
	import { collection, getDocs } from 'firebase/firestore';
	import { onMount } from 'svelte';

	const app = initializeApp(firebaseConfig);
	const db = getFirestore(app);

	let html_pelanggans: string = '';
	onMount(async () => {
		const querySnapshot = await getDocs(collection(db, 'customers'));
		// console.log(querySnapshot);
		let pelanggans = new Array();
		querySnapshot.forEach((doc: any) => {
			// console.log(`${doc.id} => ${doc.data()}`);
			// console.log(doc.data());
			pelanggans.push({
				id: doc.id,
				nama: doc.data().nama,
				phone: doc.data().phone,
				email: doc.data().email,
				alamat: doc.data().alamat,
				tanggal_lahir: doc.data().tanggal_lahir,
				photo: doc.data().photo,
				gender: doc.data().gender,
				sapaan: doc.data().sapaan
			});
			html_pelanggans += `<tr><td>
				${doc.data().nama}
				</td>
				<td>
					<a href="/pelanggan/pelanggan_detail?id=${doc.id}" class="btn-emerald-sm rounded">D</a>
				</td>
			</tr>`;
		});
		// console.log(pelanggans);
	});
</script>

<div class="text-right p-3">
	<a href="/pelanggan/tambah_pelanggan" class="btn-emerald rounded-full">+Pelanggan</a>
</div>

<div class="mx-2">
	<table class="table-nice">
		<thead>
			<tr>
				<th>Nama</th>
				<th>Opsi</th>
			</tr>
		</thead>
		<tbody>
			{@html html_pelanggans}
		</tbody>
	</table>
</div>
