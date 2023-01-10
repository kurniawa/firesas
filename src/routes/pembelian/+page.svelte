<script lang="ts">
	import loading_gif from '$lib/assets/Wedges-3s-200px.gif';
	import JsBarcode from 'jsbarcode';
	import { admin_ids } from './../../auth/authStores';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { Timestamp } from 'firebase/firestore';
	import type { dataPelanggan } from 'src/interfaces/Customer';
	import { onMount } from 'svelte';
	import {
		getCustomerFromFirestore,
		updateUsernameOfCustomer,
		updateDataOfCustomer,
		uploadImageToFirebaseStorage,
		deleteFileFromStorage
	} from './../../auth/authStores';

	export let data;
	// console.log('+page:', data);
	let params = data.params;
	// console.log('params:');
	// console.log(params);
	let showLoadingAnimation = false;

	let showPage = true;
	let displayName: any = '';
	onMount(() => {
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (user) {
				// User is signed in, see docs for a list of available properties
				// https://firebase.google.com/docs/reference/js/firebase.User
				const uid = user.uid;
				// ...
				// console.log(user.displayName);
				displayName = user.displayName;
				// console.log('is_admin:', admin_ids.includes(user.uid));
				showPage = true;
			} else {
				// User is signed out
				// ...
				// console.log('belum login');
				displayName = '';
				showPage = false;
			}
		});
		JsBarcode('#barcode', '711211351k2');
		JsBarcode('#barcode2', '71121135g1c2r');
	});

	function insertToCart() {}

	let feedback = {
		updating: '',
		status: 200,
		message: ''
	};
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
		<form on:submit|preventDefault={insertToCart} class="m-2">
			<input type="text" class="input" placeholder="Kode Barang" />
			<div class="mt-2">
				<button type="submit" class="btn-dd rounded">+Keranjang</button>
			</div>
		</form>
		<svg id="barcode" />
		<svg id="barcode2" />
	</div>
{/if}
