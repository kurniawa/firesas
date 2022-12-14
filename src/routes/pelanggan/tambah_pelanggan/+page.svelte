<script lang="ts">
	import type { dataPelanggan } from 'src/interfaces/Customer';
	import {
		addCustomer,
		updateCustomerPhoto,
		uploadImageToFirebaseStorage
	} from './../../../auth/authStores';
	let form: dataPelanggan = {
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

	let invalid_feedback = '';
	let success = '';

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
	function tambah_pelanggan() {
		addCustomer(form)
			.then((new_pelanggan_id) => {
				// console.log('new_pelanggan_id:', new_pelanggan_id);
				success += 'Pelanggan baru telah diinput ke dalam database!';
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
							true,
							new_pelanggan_id,
							filename
						);
					}
					// console.log('imageurl:', imageurl);
					// success += ' Profile Picture telah diinput ke dalam storage!';
					// if (typeof new_pelanggan_id !== 'undefined') {
					// 	updateCustomerPhoto(new_pelanggan_id, filename, imageurl).then((result) => {
					// 		success += ` ${result}`;
					// 	});
					// }
					// balik lagi kembali update
				}
			})
			.catch((error) => {
				console.log(error);
			});
		// console.log(image_file);
	}
</script>

<div class="m-3">
	<div class="inline-block rounded p-2 bg-white shadow drop-shadow">
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
					d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
				/>
			</svg>

			<h3 class="ml-1">Tambah Pelanggan</h3>
		</div>
	</div>

	<form
		on:submit|preventDefault={tambah_pelanggan}
		class="p-5 border rounded bg-white shadow drop-shadow mt-5"
	>
		<div class="mt-3">
			<label for="displayName">Nama :</label>
			<input
				bind:value={form.nama}
				type="text"
				id="displayName"
				placeholder="Raffi Ahmad"
				class="border border-slate-400 text-slate-700 shadow rounded w-full px-3 py-2 block placeholder:text-slate-400 focus:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 invalid:text-pink-700 invalid:focus:ring-pink-700;"
				required
			/>
		</div>

		<div class="mt-3">
			<label for="gender" class="block">Gender :</label>
			<div class="flex items-center">
				<input bind:group={form.gender} type="radio" name="gender" id="pria" value={'pria'} />
				<label for="pria" class="ml-1">pria</label>
				<input
					bind:group={form.gender}
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
				bind:value={form.phone}
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
				bind:value={form.email}
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
				bind:value={form.alamat.baris_1}
				type="text"
				id="baris-1"
				class="border border-slate-400 text-slate-700 shadow rounded w-full px-3 py-2 block placeholder:text-slate-400 focus:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 invalid:text-pink-700 invalid:focus:ring-pink-700;"
			/>
			<label for="baris-2">Baris 2 :</label>
			<input
				bind:value={form.alamat.baris_2}
				type="text"
				id="baris-2"
				class="border border-slate-400 text-slate-700 shadow rounded w-full px-3 py-2 block placeholder:text-slate-400 focus:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 invalid:text-pink-700 invalid:focus:ring-pink-700;"
			/>
			<label for="provinsi">Provinsi :</label>
			<input
				bind:value={form.alamat.provinsi}
				type="text"
				id="provinsi"
				class="border border-slate-400 text-slate-700 shadow rounded w-full px-3 py-2 block placeholder:text-slate-400 focus:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 invalid:text-pink-700 invalid:focus:ring-pink-700;"
			/>
			<div class="grid grid-cols-2 gap-2">
				<div>
					<label for="kota">Kota :</label>
					<input
						bind:value={form.alamat.kota}
						type="text"
						id="kota"
						class="border border-slate-400 text-slate-700 shadow rounded w-full px-3 py-2 block placeholder:text-slate-400 focus:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 invalid:text-pink-700 invalid:focus:ring-pink-700;"
					/>
				</div>
				<div>
					<label for="kodepos">Kodepos :</label>
					<input
						bind:value={form.alamat.kodepos}
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
		{#if success !== ''}
			<div class="alert-success mt-2">{success}</div>
		{/if}

		<img
			class="upload"
			src="https://static.thenounproject.com/png/625182-200.png"
			alt=""
			on:click={() => {
				file_input.click();
			}}
			on:keyup={() => {
				file_input.click();
			}}
		/>
		<div
			class="chan"
			on:click={() => {
				file_input.click();
			}}
			on:keyup={() => {
				file_input.click();
			}}
		>
			Choose Image
		</div>
		<input
			style="display:none"
			type="file"
			accept=".jpg, .jpeg, .png"
			on:change={(e) => onFileSelected(e)}
			bind:this={file_input}
		/>

		<div class="mt-3 text-center">
			<button type="submit" class="btn-emerald rounded">+Tambah Pelanggan</button>
		</div>
	</form>

	<!-- <form class="p-5 border rounded bg-white shadow drop-shadow mt-5" enctype="multipart/form-data">
		
		<div class="mt-3 text-center">
			<button type="submit" class="btn-emerald rounded">Test Upload</button>
		</div>
	</form> -->
</div>
