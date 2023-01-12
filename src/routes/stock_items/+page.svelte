<script lang="ts">
	import loading_gif from '$lib/assets/Wedges-3s-200px.gif';
	import JsBarcode from 'jsbarcode';
	import { loopingTipePerhiasan } from './stores';
	import { initializeApp } from 'firebase/app';
	import { firebaseConfig } from './../../auth/firebase.config';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { Timestamp, getFirestore, collection, getDocs } from 'firebase/firestore';
	import type { dataPerhiasan } from 'src/interfaces/Customer';
	import { onMount } from 'svelte';
	import {
		getCustomerFromFirestore,
		updateUsernameOfCustomer,
		updateDataOfCustomer,
		uploadImageToFirebaseStorage,
		deleteFileFromStorage,
		admin_ids
	} from './../../auth/authStores';

	export let data;
	// console.log('+page:', data);
	let params = data.params;
	// console.log('params:');
	// console.log(params);
	const app = initializeApp(firebaseConfig);
	const db = getFirestore(app);
	let showLoadingAnimation = false;

	let showPage = true;
	let displayName: any = '';
	let stock_items = new Array();
	let stock_ats = new Array();
	let stock_gws = new Array();
	let stock_ccs = new Array();
	let stock_kls = new Array();
	let stock_gls = new Array();
	let stock_lions = new Array();
	let stock_lms = new Array();
	let stock_boxs = new Array();
	onMount(() => {
		const auth = getAuth();
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				// User is signed in, see docs for a list of available properties
				// https://firebase.google.com/docs/reference/js/firebase.User
				const uid = user.uid;
				// ...
				// console.log(user.displayName);
				displayName = user.displayName;
				// console.log('is_admin:', admin_ids.includes(user.uid));
				showPage = true;
				const querySnapshot = await getDocs(collection(db, 'items'));
				// console.log(querySnapshot);
				querySnapshot.forEach((doc) => {
					// doc.data() is never undefined for query doc snapshots
					// console.log(doc.id, ' => ', doc.data());
					let retrieved_item = {
						doc_id: doc.id,
						berat: doc.data().berat,
						jenis: doc.data().jenis,
						kadar: doc.data().kadar,
						kategori: doc.data().kategori,
						kode: doc.data().kode,
						mata: doc.data().mata,
						nama: doc.data().nama,
						nama_short: doc.data().nama_short,
						photo_file: doc.data().photo_file,
						photo_link: doc.data().photo_link,
						stok: doc.data().stok,
						tipe_perhiasan: doc.data().tipe_perhiasan,
						tipe_emas: doc.data().tipe_emas
					};
					if (doc.data().tipe_perhiasan === 'at') {
						stock_ats.push(retrieved_item);
					} else if (doc.data().tipe_perhiasan === 'gw') {
						stock_gws.push(retrieved_item);
					} else if (doc.data().tipe_perhiasan === 'cc') {
						stock_ccs.push(retrieved_item);
					} else if (doc.data().tipe_perhiasan === 'kl') {
						stock_kls.push(retrieved_item);
					} else if (doc.data().tipe_perhiasan === 'gl') {
						stock_gls.push(retrieved_item);
					} else if (doc.data().tipe_perhiasan === 'lion') {
						stock_lions.push(retrieved_item);
					} else if (doc.data().tipe_perhiasan === 'lm') {
						stock_lms.push(retrieved_item);
					} else if (doc.data().tipe_perhiasan === 'box') {
						stock_boxs.push(retrieved_item);
					}
				});
				console.log(stock_ats);
				console.log(stock_ccs);
			} else {
				// User is signed out
				// ...
				// console.log('belum login');
				displayName = '';
				showPage = false;
			}
		});
		JsBarcode('#barcode', '7110211013509901.2');
		JsBarcode('#barcode2', '71401101420002-1');
		JsBarcode('#barcode3', '10001');
		JsBarcode('#barcode4', '01234510015',{format:"upc"});
		JsBarcode('#barcode5', '123456789012',{format:"upc",displayValue:false});
	});

	let item = {
		kode_barang: ''
	};
	function addItemToStock() {}

	function isItemExist() {}

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
		<form on:submit|preventDefault={addItemToStock} class="m-2">
			<input
				type="text"
				class="input"
				placeholder="Kode Barang"
				bind:value={item.kode_barang}
				on:change={isItemExist}
			/>
			<div class="mt-2">
				<button type="submit" class="btn-dd rounded">+Tambah ke Stock</button>
			</div>
		</form>
		<svg id="barcode" />
		<svg id="barcode2" />
		<svg id="barcode3" />
		<svg id="barcode4" />
		<svg id="barcode5" />
		<svg id="barcode6" />
		<svg id="barcode7" />
		<button on:click={loopingTipePerhiasan} class="btn-danger rounded"
			>Migrate Tipe Perhiasan</button
		>
	</div>
{/if}
