<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { dataPelanggan } from 'src/interfaces/Customer';
	import { afterUpdate, onMount } from 'svelte';
	import {
		addCustomer,
		getCustomerFromFirestore,
		updateCustomerPhoto,
		uploadImageToFirebaseStorage
	} from './../../../auth/authStores';
	import loading_gif from '$lib/assets/Wedges-3s-200px.gif';
	let pelanggan: dataPelanggan={
        nama: '',
		username: '',
		gender: '',
		phone: '',
		email: '',
		tanggal_lahir: '',
		alamat: {
			baris_1: '',
			baris_2: '',
			provinsi: '',
			kota: '',
			kodepos: ''
		},
		photo: '',
		photo_link: '',
		photo_id: '',
		photo_id_link: '',
		desc: '',
		user_id: ''
    };

	let invalid_feedback = '';
	let disableTambahPelanggan = false;
	let showLoadingAnimation = false;
	let success_logs: string = '';
	let danger_logs: string = '';
	onMount(() => {
		sessionStorage.setItem('success_logs', '');
		sessionStorage.setItem('danger_logs', '');
		// console.log('masuk ke onmount');
	});

	// afterUpdate(()=>{
	// 	success_logs = sessionStorage.getItem('success_logs');
	// 	danger_logs = sessionStorage.getItem('danger_logs');
	// 	console.log('masuk ke after update');

	// })
	const getSession = () => {
		const verify_success_logs = sessionStorage.getItem('success_logs');
		success_logs = verify_success_logs !== null ? verify_success_logs : '';
		const verify_danger_logs = sessionStorage.getItem('danger_logs');
		danger_logs = verify_danger_logs !== null ? verify_danger_logs : '';
		console.log('masuk ke getSession');
	};

    const isPelangganIDExist = $page.url.searchParams.has('id'); // return true or false
	let pelanggan_id: string | null;
	let showPage = true;
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

	let file_input: any;
	let image_file: any;
	const onFileSelected = (e: any) => {
		let image = e.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (e) => {
			//  avatar = e.target.result
			if (e.target !== null) {
				// console.log(e.target.result);
				// image_file = e.target.result;
			}
		};
		image_file = image;
		// console.log(image_file);
		// console.log(image_file.type);
	};
	function edit_pelanggan() {
		disableTambahPelanggan = true;
		showLoadingAnimation = true;
		addCustomer(pelanggan)
			.then((new_pelanggan_id) => {
				// console.log('new_pelanggan_id:', new_pelanggan_id);
				success_logs += 'Pelanggan baru berhasil didaftarkan!';
				sessionStorage.setItem('success_logs', success_logs);
				if (typeof image_file !== 'undefined') {
					// console.log('not undefined');

					// get extension from filename
					// source: https://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
					var fileExt = image_file.name.split('.').pop();
					let filename = `${new_pelanggan_id}-` + new Date().getTime().toString() + `.${fileExt}`;
					// console.log(filename);
					if (typeof new_pelanggan_id !== 'undefined') {
						uploadImageToFirebaseStorage(
							image_file,
							`profile_pictures/${filename}`,
							true,'photo',
							new_pelanggan_id,
							filename
						).finally(() => {
							success_logs +=
								'Profile picture berhasil disimpan di storage. Data Pelanggan Link Photo berhasil diupdate!';
							sessionStorage.setItem('success_logs', success_logs);
						});
					}
					// console.log('imageurl:', imageurl);
					// if (typeof new_pelanggan_id !== 'undefined') {
					// 	updateCustomerPhoto(new_pelanggan_id, filename, imageurl).then((result) => {
					// 	});
					// }
					// balik lagi kembali update
				}
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				getSession();
				showLoadingAnimation = false;
				setTimeout(() => {
					routeToPage(`/pelanggan/pelanggan_detail?id=${pelanggan_id}`, true);
				}, 3000);
			});
		// console.log(image_file);
	}

	function routeToPage(route: string, replaceState: boolean) {
		// goto(`/${route}`, { replaceState })
		goto(route);
	}

    
</script>

<div class="relative">
	{#if showLoadingAnimation}
		<div class="absolute top-0 -bottom-56 z-30 w-full bg-gray-50 opacity-50" />
		<img
			class="absolute w-1/4 z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
			src={loading_gif}
			alt="loading animation"
		/>
	{/if}

	<div class="m-3">
		<div class="inline-block rounded p-2 bg-white shadow drop-shadow">
			<div class="flex items-center">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  

				<h3 class="ml-1">Edit Pelanggan</h3>
			</div>
		</div>

		<form
			on:submit|preventDefault={edit_pelanggan}
			class="p-5 border rounded bg-white shadow drop-shadow mt-5"
		>
			<div class="">
				<label for="displayName">Nama :</label>
				<input
					bind:value={pelanggan.nama}
					type="text"
					id="displayName"
					placeholder="Raffi Ahmad"
					class="border border-slate-400 text-slate-700 shadow rounded w-full px-3 py-2 block placeholder:text-slate-400 focus:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 invalid:text-pink-700 invalid:focus:ring-pink-700;"
					required
				/>
			</div>

			<div class="mt-3">
				<label for="username">Username :</label>
				<input
					bind:value={pelanggan.username}
					type="text"
					id="username"
					placeholder="Raffi Ahmad"
					class="border border-slate-400 text-slate-700 shadow rounded w-full px-3 py-2 block placeholder:text-slate-400 focus:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 invalid:text-pink-700 invalid:focus:ring-pink-700;"
					required
				/>
			</div>

			<div class="mt-3">
				<label for="gender" class="block">Gender :</label>
				<div class="flex items-center">
					<input bind:group={pelanggan.gender} type="radio" name="gender" id="pria" value={'pria'} />
					<label for="pria" class="ml-1">pria</label>
					<input
						bind:group={pelanggan.gender}
						type="radio"
						name="gender"
						id="wanita"
						value={'wanita'}
						class="ml-3"
					/>
					<label for="wanita" class="ml-1">wanita</label>
				</div>
			</div>

			<div class="mt-3">
				<label for="no_hp">No. HP :</label>
				<input
					bind:value={pelanggan.phone}
					type="text"
					id="no_hp"
					placeholder="0889 . . ."
					class="border border-slate-400 text-slate-700 shadow rounded w-full px-3 py-2 block placeholder:text-slate-400 focus:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 invalid:text-pink-700 invalid:focus:ring-pink-700;"
					required
				/>
			</div>

			<div class="mt-3">
				<label for="email">Email :</label>
				<input
					bind:value={pelanggan.email}
					type="email"
					id="email"
					placeholder="nagita@slavina.com"
					class="border border-slate-400 text-slate-700 shadow rounded w-full px-3 py-2 block placeholder:text-slate-400 focus:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 invalid:text-pink-700 invalid:focus:ring-pink-700;"
				/>
			</div>

			<label for="alamat" class="block mt-3 font-semibold">Alamat</label>
			<div class="p-2 border-4 border-indigo-200 rounded">
				<label for="baris-1">Baris 1 :</label>
				<input
					bind:value={pelanggan.alamat.baris_1}
					type="text"
					id="baris-1"
					class="border border-slate-400 text-slate-700 shadow rounded w-full px-3 py-2 block placeholder:text-slate-400 focus:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 invalid:text-pink-700 invalid:focus:ring-pink-700;"
				/>
				<label for="baris-2">Baris 2 :</label>
				<input
					bind:value={pelanggan.alamat.baris_2}
					type="text"
					id="baris-2"
					class="border border-slate-400 text-slate-700 shadow rounded w-full px-3 py-2 block placeholder:text-slate-400 focus:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 invalid:text-pink-700 invalid:focus:ring-pink-700;"
				/>
				<label for="provinsi">Provinsi :</label>
				<input
					bind:value={pelanggan.alamat.provinsi}
					type="text"
					id="provinsi"
					class="border border-slate-400 text-slate-700 shadow rounded w-full px-3 py-2 block placeholder:text-slate-400 focus:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 invalid:text-pink-700 invalid:focus:ring-pink-700;"
				/>
				<div class="grid grid-cols-2 gap-2">
					<div>
						<label for="kota">Kota :</label>
						<input
							bind:value={pelanggan.alamat.kota}
							type="text"
							id="kota"
							class="border border-slate-400 text-slate-700 shadow rounded w-full px-3 py-2 block placeholder:text-slate-400 focus:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 invalid:text-pink-700 invalid:focus:ring-pink-700;"
						/>
					</div>
					<div>
						<label for="kodepos">Kodepos :</label>
						<input
							bind:value={pelanggan.alamat.kodepos}
							type="text"
							id="kodepos"
							class="border border-slate-400 text-slate-700 shadow rounded w-full px-3 py-2 block placeholder:text-slate-400 focus:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 invalid:text-pink-700 invalid:focus:ring-pink-700;"
						/>
					</div>
				</div>
			</div>

			{#if invalid_feedback !== ''}
				<div class="invalid-feedback">{invalid_feedback}</div>
			{/if}
			{#if success_logs !== ''}
				<div class="alert-success mt-2">{success_logs}</div>
			{/if}

			<div class="text-center">
				<div
					class="inline-block border-2 border-pink-400 rounded p-2 mt-2"
					on:click={() => {
						file_input.click();
					}}
					on:keyup={() => {
						file_input.click();
					}}
				>
					<div class="flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
							/>
						</svg>

						<div class="ml-1">Ganti Foto</div>
					</div>
				</div>
			</div>
			<input
				style="display:none"
				type="file"
				accept=".jpg, .jpeg, .png"
				on:change={(e) => onFileSelected(e)}
				bind:this={file_input}
			/>

			<div class="mt-3 text-center">
				<button
					type="submit"
					class="bg-emerald-500 rounded text-white font-semibold w-full py-4 hover:bg-emerald-600 disabled:opacity-25 flex items-center justify-center"
					disabled={disableTambahPelanggan}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                      
                    <span class="ml-1">Konfirmasi Edit</span>
                    </button
				>
			</div>
		</form>

		<!-- <form class="p-5 border rounded bg-white shadow drop-shadow mt-5" enctype="multipart/form-data">
			
			<div class="mt-3 text-center">
				<button type="submit" class="btn-emerald rounded">Test Upload</button>
			</div>
		</form> -->
	</div>
</div>
