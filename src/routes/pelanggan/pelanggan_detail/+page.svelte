<script lang="ts">
	import { page } from '$app/stores';
	import type { dataPelanggan } from 'src/interfaces/Customer';
	import {
		deleteDocumentFromFirestore,
		deleteFileFromStorage,
		getCustomerFromFirestore
	} from './../../../auth/authStores';

	let data_pelanggan: dataPelanggan = {
		nama: '',
		gender: '',
		phone: '',
		email: '',
		alamat: {
			baris_1: '',
			baris_2: '',
			provinsi: '',
			kota: '',
			kodepos: ''
		},
		photo: '',
		photo_link: '',
		desc: ''
	};
	let danger_logs = '';
	let success_logs = '';
	let showPage = true;
	const isPelangganIDExist = $page.url.searchParams.has('id'); // return true or false
	let pelanggan_id: string | null;
	if (isPelangganIDExist) {
		pelanggan_id = $page.url.searchParams.get('id');
		// console.log(pelanggan_id);
		if (pelanggan_id !== null) {
			getCustomerFromFirestore(pelanggan_id)
				.then((result) => {
					if (result) {
						data_pelanggan.nama = result.nama;
						data_pelanggan.photo = result.photo;
						data_pelanggan.photo_link = result.photo_link;
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
			if (data_pelanggan.photo !== '') {
				deleteFileFromStorage(`profile_pictures/${data_pelanggan.photo}`).then((result) => {
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
</script>

{#if danger_logs !== ''}
	<div class="alert-danger mt-2">{danger_logs}</div>
{/if}
{#if showPage}
	<div class="m-2 relative">
		<div class="flex">
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
		<ul class="bg-white shadow drop-shadow rounded absolute">
			<li>
				<button on:click={hapusPelanggan} class="h-11 px-5 hover:bg-slate-100 flex items-center">
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

					<span class="ml-1">Hapus</span>
				</button>
			</li>
		</ul>
	</div>

	<div class="w-52 h-52 rounded-full overflow-hidden">
		<img src={data_pelanggan.photo_link} alt="" class="w-full" />
	</div>
	<h3>{data_pelanggan.nama}</h3>
	<span>(Detail Pelanggan)</span>
{/if}
