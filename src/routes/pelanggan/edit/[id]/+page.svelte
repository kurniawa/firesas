<script lang="ts">
	import loading_gif from '$lib/assets/Wedges-3s-200px.gif';
	import { Timestamp } from 'firebase/firestore';
	import type { dataPelanggan } from 'src/interfaces/Customer';
	import { onMount } from 'svelte';
	import {
		getCustomerFromFirestore,
		updateUsernameOfCustomer,
		updateDataOfCustomer,
		uploadImageToFirebaseStorage,
		deleteFileFromStorage
	} from './../../../../auth/authStores';

	export let data;
	// console.log('+page:', data);
	let params = data.params;
	// console.log('params:');
	// console.log(params);
	let showLoadingAnimation = false;
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
		desc: '',
		user_id: ''
	};
	let tanggal_lahir: string;
	let update_pelanggan = pelanggan;
	let showPage = true;
	getCustomer();
	function getCustomer() {
		getCustomerFromFirestore(params.id)
			.then((result) => {
				if (result) {
					pelanggan.nama = result.nama;
					pelanggan.username = result.username;
					pelanggan.gender = result.gender;
					pelanggan.phone = result.phone;
					pelanggan.email = result.email;
					result.tanggal_lahir.seconds += 60 * 60 * 7;
					// karena ada perbedaan 7 jam ketika get, aneh sih, insert ke firestore udah bener UTC +7, tapi ketika di get jadi mundur 7 jam.
					pelanggan.tanggal_lahir = result.tanggal_lahir;
					tanggal_lahir = result.tanggal_lahir.toDate().toISOString().substring(0, 16);
					pelanggan.alamat = result.alamat;
					pelanggan.photo = result.photo;
					pelanggan.photo_link = result.photo_link;
					pelanggan.desc = result.desc;

					// console.log(tanggal_lahir);
					// console.log(new Date(tanggal_lahir));
					// console.log(new Date('2023-01-01T00:00'));
					// console.log(pelanggan.tanggal_lahir);
					// console.log(pelanggan.tanggal_lahir.nanoseconds);
					// console.log(pelanggan.tanggal_lahir.toDate().toISOString().split('T')[0]);
					// console.log(new Date(pelanggan.tanggal_lahir.toDate().toISOString().split('T')[0]));
					// console.log(
					// 	new Date(pelanggan.tanggal_lahir.toDate().toISOString().split('T')[0]).getTime()
					// );
				} else {
					showPage = false;
				}
			})
			.catch((error) => {
				console.log(error);
				showPage = false;
			});
	}

	// /** @type {import('./$types').ActionData} */
	// export let form: any;
	// console.log(form);
	onMount(() => {
		// sessionStorage.setItem('success_logs', '');
		// sessionStorage.setItem('danger_logs', '');
		// console.log('masuk ke onmount');
	});

	let feedback = {
		updating: '',
		status: 200,
		message: ''
	};
	async function updateUsername() {
		showLoadingAnimation = true;
		resetSession();
		// VALIDASI
		update_pelanggan.username = update_pelanggan.username.trim();
		if (update_pelanggan.username === '') {
			feedback.updating = 'username';
			feedback.status = 400;
			feedback.message = 'Invalid Username!';
			showLoadingAnimation = false;
			return false;
		}
		feedback = await updateUsernameOfCustomer(params.id, update_pelanggan.username);
		if (feedback.status === 200) {
			getCustomer();
			showLoadingAnimation = false;
		} else {
			showLoadingAnimation = false;
		}
	}

	function resetSession() {
		// sessionStorage.setItem('success_logs', '');
		// sessionStorage.setItem('danger_logs', '');
		feedback = {
			updating: '',
			status: 200,
			message: ''
		};
	}

	async function updateUserData() {
		showLoadingAnimation = true;
		resetSession();
		// VALIDASI
		update_pelanggan.nama = update_pelanggan.nama.trim();
		update_pelanggan.gender = update_pelanggan.gender.trim();
		tanggal_lahir = tanggal_lahir.trim();
		update_pelanggan.email = update_pelanggan.email.trim();
		update_pelanggan.phone = update_pelanggan.phone.trim();
		update_pelanggan.alamat.baris_1 = update_pelanggan.alamat.baris_1.trim();
		update_pelanggan.alamat.baris_2 = update_pelanggan.alamat.baris_2.trim();
		update_pelanggan.alamat.kota = update_pelanggan.alamat.kota.trim();
		update_pelanggan.alamat.provinsi = update_pelanggan.alamat.provinsi.trim();
		update_pelanggan.alamat.kodepos = update_pelanggan.alamat.kodepos.trim();
		update_pelanggan.alamat.daerah = update_pelanggan.alamat.daerah.trim();
		update_pelanggan.desc = update_pelanggan.desc.trim();
		// console.log('tanggal_lahir');
		// console.log(tanggal_lahir);
		// return false;
		if (update_pelanggan.nama === '') {
			feedback.updating = 'data_user';
			feedback.status = 400;
			feedback.message = 'Nama harus diisi!';
			showLoadingAnimation = false;
			return false;
		}
		if (update_pelanggan.phone === '') {
			feedback.updating = 'data_user';
			feedback.status = 400;
			feedback.message = 'Phone harus diisi!';
			showLoadingAnimation = false;
			return false;
		}
		feedback = await updateDataOfCustomer(
			params.id,
			update_pelanggan.nama,
			update_pelanggan.gender,
			tanggal_lahir,
			update_pelanggan.email,
			update_pelanggan.phone,
			update_pelanggan.alamat.baris_1,
			update_pelanggan.alamat.baris_2,
			update_pelanggan.alamat.kota,
			update_pelanggan.alamat.provinsi,
			update_pelanggan.alamat.kodepos,
			update_pelanggan.alamat.daerah,
			update_pelanggan.desc
		);
		if (feedback.status === 200) {
			getCustomer();
			showLoadingAnimation = false;
		} else {
			showLoadingAnimation = false;
		}
	}

	let file_input: any;
	let image_file: any;
	const onFileSelected = (e: any) => {
		showLoadingAnimation = true;
		resetSession();
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
		if (typeof image_file !== 'undefined') {
			// console.log('not undefined');

			// get extension from filename
			// source: https://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
			var fileExt = image_file.name.split('.').pop();
			let filename = `${params.id}-` + new Date().getTime().toString() + `.${fileExt}`;
			// console.log(filename);

			// DELETE FILE PHOTO SEBELUMNYA KALAU ADA
			if (typeof pelanggan.photo !== 'undefined' && pelanggan.photo !== '') {
				deleteFileFromStorage(`profile_pictures/${pelanggan.photo}`).then(() => {
					feedback.message += 'Profile picture lama berhasil dihapus!';
				});
			}
			if (typeof params.id !== 'undefined') {
				uploadImageToFirebaseStorage(
					image_file,
					`profile_pictures/${filename}`,
					true,
					params.id,
					filename
				).finally(() => {
					feedback.status = 200;
					feedback.updating = 'profile_picture';
					feedback.message +=
						'Profile picture berhasil disimpan di storage. Data Pelanggan Link Photo berhasil diupdate!';
				});
			}
		}

		setTimeout(() => {
			getCustomer();
			showLoadingAnimation = false;
		}, 2000);
	};

	async function changePassword() {
		showLoadingAnimation = true;
		resetSession();
	}
</script>

{#if showPage}
	<div class="relative">
		{#if showLoadingAnimation}
			<div class="absolute top-0 -bottom-56 z-30 w-full bg-gray-50 opacity-50" />
			<img
				class="absolute w-1/4 z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
				src={loading_gif}
				alt="loading animation"
			/>
		{/if}
		<!-- Content mulai dari sini -->
		<div class="m-2">
			<div class="flex justify-center">
				<div class="w-36 h-36 relative">
					<div class="w-full h-full border-4 border-slate-100 rounded-full overflow-hidden">
						{#if typeof pelanggan.photo_link !== 'undefined' && pelanggan.photo_link !== ''}
							<!-- content here -->
							<img src={pelanggan.photo_link} alt="" class="w-full" />
						{:else}
							<!-- else content here -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-full"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
								/>
							</svg>
						{/if}
					</div>
					<div class="absolute bottom-0 right-0">
						<label
							for=""
							on:click={() => {
								file_input.click();
							}}
							on:keyup={() => {
								file_input.click();
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-5 h-5 text-slate-400"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
								/>
							</svg>
						</label>
						<input
							style="display:none"
							type="file"
							accept=".jpg, .jpeg, .png"
							on:change={(e) => onFileSelected(e)}
							bind:this={file_input}
						/>
					</div>
				</div>
			</div>
			{#if feedback.updating === 'profile_picture' && feedback.status === 200}
				<div class="alert-success mt-2">{feedback.message}</div>
			{:else if feedback.updating === 'profile_picture' && feedback.status === 400}
				<div class="alert-danger mt-2">{feedback.message}</div>
			{/if}
			<div class="text-center">
				<h3>{pelanggan.nama}</h3>
				<span>(Detail Pelanggan)</span>
			</div>

			<!-- <form method="POST" action="?/edit_username">
				<table class="table-nice w-full mt-3">
					<tr>
						<th>Username</th><th>:</th><td>{pelanggan.username}</td>
					</tr>
					<tr>
						<td colspan="3">
							<div>
								<label for="">Change Username:</label>
								<input type="text" name="username" class="input w-full mt-1" />
								{#if form?.incorrect}<p class="error">Invalid username!</p>{/if}
							</div>
							<div class="text-right mt-2">
								<button type="submit" class="btn-indigo rounded">Konfirm Edit Username</button>
								<input type="hidden" name="pelanggan_id" value={params.id} />
							</div>
						</td>
					</tr>
				</table>
			</form> -->
			<form on:submit|preventDefault={updateUsername}>
				<table class="table-nice w-full mt-3">
					<tr>
						<th>Username</th><th>:</th><td>{pelanggan.username}</td>
					</tr>
					<tr>
						<td colspan="3">
							<div>
								<label for="">Change Username:</label>
								<input
									type="text"
									name="username"
									class="input w-full mt-1"
									bind:value={update_pelanggan.username}
								/>
							</div>
							{#if feedback.updating === 'username' && feedback.status === 200}
								<div class="alert-success mt-2">{feedback.message}</div>
							{:else if feedback.updating === 'username' && feedback.status === 400}
								<div class="alert-danger mt-2">{feedback.message}</div>
							{/if}
							<div class="text-right mt-2">
								<button type="submit" class="btn-indigo rounded">Konfirm Edit Username</button>
								<input type="hidden" name="pelanggan_id" value={params.id} />
							</div>
						</td>
					</tr>
				</table>
			</form>
			<form on:submit|preventDefault={updateUserData}>
				<table class="table-nice w-full mt-3">
					<tr>
						<th>Nama</th><th>:</th>
						<td>
							<input type="text" name="nama" class="input w-full" bind:value={pelanggan.nama} />
						</td>
					</tr>
					<tr>
						<th>Gender</th><th>:</th>
						<td>
							<select name="gender" class="input" bind:value={pelanggan.gender}>
								<option value={pelanggan.gender}>{pelanggan.gender}</option>
								<option value="">-</option>
								<option value="pria">pria</option>
								<option value="wanita">wanita</option>
							</select>
						</td>
					</tr>
					<tr>
						<th>Tgl.Lhr.</th><th>:</th>
						<td
							><input
								type="datetime-local"
								name="tanggal_lahir"
								class="input"
								bind:value={tanggal_lahir}
							/></td
						>
					</tr>
					<tr>
						<th>Email</th><th>:</th>
						<td>
							<input type="email" name="email" class="input w-full" bind:value={pelanggan.email} />
						</td>
					</tr>
					<tr>
						<th>No.HP</th><th>:</th><td
							><input
								type="text"
								name="phone"
								class="input w-full"
								bind:value={pelanggan.phone}
							/></td
						>
					</tr>
					<tr>
						<th>Alamat</th><th>:</th><td />
					</tr>
					<tr>
						<td colspan="3">
							<table class="w-full">
								<tr>
									<td><label for="alamat.baris_1">Baris 1</label></td>
									<td>:</td>
									<td
										><input
											type="text"
											name="alamat.baris_1"
											bind:value={pelanggan.alamat.baris_1}
											class="input ml-2 w-full"
										/></td
									>
								</tr>
								<tr>
									<td>
										<label for="alamat.baris_2">Baris 2</label>
									</td>
									<td>:</td>
									<td
										><input
											type="text"
											name="alamat.baris_2"
											bind:value={pelanggan.alamat.baris_2}
											class="input ml-2 w-full"
										/></td
									>
								</tr>
								<tr>
									<td>
										<label for="alamat.kota">Kota</label>
									</td>
									<td>:</td>
									<td>
										<input
											type="text"
											name="alamat.kota"
											bind:value={pelanggan.alamat.kota}
											class="input ml-2 w-full"
										/>
									</td>
								</tr>
								<tr>
									<td>
										<label for="alamat.provinsi">Provinsi</label>
									</td>
									<td>:</td>
									<td>
										<input
											type="text"
											name="alamat.provinsi"
											bind:value={pelanggan.alamat.provinsi}
											class="input ml-2 w-full"
										/>
									</td>
								</tr>
								<tr>
									<td>
										<label for="alamat.kodepos">Kodepos</label>
									</td>
									<td>:</td>
									<td>
										<input
											type="text"
											name="alamat.kodepos"
											bind:value={pelanggan.alamat.kodepos}
											class="input ml-2 w-full"
										/>
									</td>
								</tr>
								<tr>
									<td>
										<label for="alamat.daerah">Daerah</label>
									</td>
									<td>:</td>
									<td>
										<input
											type="text"
											name="alamat.daerah"
											bind:value={pelanggan.alamat.daerah}
											class="input ml-2 w-full"
										/>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr>
						<th>Desc.</th><th>:</th>
						<td>
							<input type="text" name="desc" class="input w-full" bind:value={pelanggan.desc} />
						</td>
					</tr>
				</table>
				{#if feedback.updating === 'data_user' && feedback.status === 200}
					<div class="alert-success mt-2">{feedback.message}</div>
				{:else if feedback.updating === 'data_user' && feedback.status === 400}
					<div class="alert-danger mt-2">{feedback.message}</div>
				{/if}
				<div class="mt-2 text-center">
					<button class="btn-indigo rounded">Konfirm Edit User Data</button>
				</div>
			</form>
		</div>
	</div>
{/if}
