<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Timestamp } from 'firebase/firestore';
	import type { dataPelanggan } from 'src/interfaces/Customer';
	import { onMount } from 'svelte';
	import {
		deleteDocumentFromFirestore,
		deleteFileFromStorage,
		getCustomerFromFirestore
	} from './../../../auth/authStores';

	let pelanggan: dataPelanggan = {
		nama: '',
		username: '',
		gender: '',
		phone: '',
		email: '',
		tanggal_lahir: Timestamp.fromDate(new Date()),
		alamat: {
			baris_1: '',
			baris_2: '',
			provinsi: '',
			kota: '',
			kodepos: '',
			daerah: ''
		},
		photo: '',
		photo_link: '',
		photo_id: '',
		photo_id_link: '',
		desc: '',
		user_id: ''
	};
	let showPage = true;
	// Session feedback etc.
	let success_logs: string = '';
	let danger_logs: string = '';
	onMount(() => {
		sessionStorage.setItem('success_logs', '');
		sessionStorage.setItem('danger_logs', '');
		// console.log('masuk ke onmount');
	});
	const isPelangganIDExist = $page.url.searchParams.has('id'); // return true or false
	let pelanggan_id: string | null;
	if (isPelangganIDExist) {
		pelanggan_id = $page.url.searchParams.get('id');
		// console.log(pelanggan_id);
		if (pelanggan_id !== null) {
			getCustomerFromFirestore(pelanggan_id)
				.then((result) => {
					if (result) {
						pelanggan.nama = result.nama;
						pelanggan.gender = result.gender;
						pelanggan.phone = result.phone;
						pelanggan.email = result.email;
						pelanggan.tanggal_lahir = result.tanggal_lahir;
						pelanggan.alamat = result.alamat;
						pelanggan.photo = result.photo;
						pelanggan.photo_link = result.photo_link;
						pelanggan.photo_id = result.photo_id;
						pelanggan.photo_id_link = result.photo_id_link;
						pelanggan.desc = result.desc;
					} else {
						showPage = false;
					}
				})
				.catch((error) => {
					console.log(error);
					showPage = false;
				});
		}
	}

	function hapusPelanggan() {
		// console.log(confirm('Apakah Anda yakin ingin menghapus pelanggan ini?'));
		if (confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
			// hapus dulu apabila ada data di storage
			if (pelanggan.photo !== '') {
				deleteFileFromStorage(`profile_pictures/${pelanggan.photo}`).then((result) => {
					danger_logs += ` ${result}`;
				});
			}
			if (pelanggan.photo_id !== '') {
				deleteFileFromStorage(`id_photos/${pelanggan.photo_id}`).then((result) => {
					danger_logs += ` ${result}`;
				});
			}
			if (pelanggan_id !== null) {
				deleteDocumentFromFirestore('customers', pelanggan_id).then((result) => {
					danger_logs += ` ${result}`;
				});
			}
		}
	}

	let showDD = false;
	const closeDD = () => {
		showDD = false;
	};
	const toggleDD = () => {
		showDD = !showDD;
	};
</script>

{#if showPage}
	<div class="relative">
		<div class="flex m-2" on:click={toggleDD} on:keyup={toggleDD}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6 bg-white shadow drop-shadow rounded hover:bg-slate-100"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
				/>
			</svg>
		</div>
		{#if showDD}
			<div on:click={closeDD} on:keyup={closeDD} class="absolute w-full -top-2 -bottom-56 z-30" />
			<ul class="bg-white shadow drop-shadow rounded absolute z-50 top-6 left-2">
				<li>
					<button
						on:click={hapusPelanggan}
						class="h-12 px-5 hover:bg-slate-100 flex items-center border-b w-full"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-5 h-5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
							/>
						</svg>

						<span class="ml-3">Edit</span>
					</a>
				</li>
				<li>
					<button
						on:click={hapusPelanggan}
						class="h-12 px-5 hover:bg-slate-100 flex items-center w-full"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-5 h-5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
							/>
						</svg>

						<span class="ml-3">Hapus</span>
					</button>
				</li>
			</ul>
		{/if}
		{#if danger_logs !== ''}
			<div class="alert-danger mt-2">{danger_logs}</div>
		{/if}

		<!-- Content mulai dari sini -->
		<div class="m-2">
			<div class="flex justify-center">
				<div class="w-36 h-36 rounded-full overflow-hidden">
					<img src={pelanggan.photo_link} alt="" class="w-full" />
				</div>
			</div>
			<div class="text-center">
				<h3>{pelanggan.nama}</h3>
				<span>(Detail Pelanggan)</span>
			</div>

			<table class="table-nice w-full mt-3">
				<tr>
					<th>Username</th><th>:</th><td>{pelanggan.username}</td>
				</tr>
				<tr>
					<th>Gender</th><th>:</th><td>{pelanggan.gender}</td>
				</tr>
				<tr>
					<th>Tgl.Lhr.</th><th>:</th><td>{pelanggan.tanggal_lahir}</td>
				</tr>
				<tr>
					<th>Email</th><th>:</th><td>{pelanggan.email}</td>
				</tr>
				<tr>
					<th>No.HP</th><th>:</th><td>{pelanggan.phone}</td>
				</tr>
				<tr>
					<th>Alamat</th><th>:</th><td>{pelanggan.alamat}</td>
				</tr>
				<tr>
					<th>Desc.</th><th>:</th><td>{pelanggan.desc}</td>
				</tr>
			</table>
		</div>
	</div>
{/if}
