import { initializeApp } from 'firebase/app';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from './../../../../auth/firebase.config';

const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

import { error, fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }: { params: any }) {
	// console.log('params:', params);
	// const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
	// console.log(apiKey);
	// const url = `https://api.spoonacular.com/recipes/${params.id}/information?apiKey=${apiKey}`;
	// const res = await fetch(url);
	// const result = await res.json();
	// console.log(result);

	// if (res.ok) {
	// 	return {
	// 		recipe_info: result
	// 	};
	// }
	// throw error(404, 'Not found');
	return {
		params: params
	};
}

/** @type {import('./$types').Actions} */
import { redirect } from '@sveltejs/kit';
import { updateUsernameOfCustomer } from './../../../../auth/authStores';
export const actions = {
	// default: async (event: any, { cookies, request }: any) => {
	edit_username: async ({ cookies, request }: any) => {
		// TODO log the user in
		// console.log('posted_data:', event);
		const data = await request.formData();
		console.log('data:');
		console.log(data);
		const [username_obj, id_obj] = data;
		// console.log(emailField, passwordField);
		const username = username_obj[1].trim();
		const pelanggan_id = id_obj[1];
		let res;
		if (username !== '') {
			const customerRef = doc(db, 'customers', pelanggan_id);
			await updateDoc(customerRef, {
				username: username
			});
		}

		// return username;
		// if (!email) {
		// 	return {
		// 		status: 404,
		// 		body: { errors: 'Email is not valid!' }
		// 	};
		// }
		// if (!password) {
		// 	return {
		// 		status: 404,
		// 		body: { errors: 'Password is not valid!' }
		// 	};
		// }

		// // throw redirect(302, '/');
		// throw redirect(307, '/');
	},
	edit_password: async ({ cookies, request }: any) => {
		// TODO log the user in
		// console.log('posted_data:', event);
		const data = await request.formData();
		console.log('data:');
		console.log(data);
		const [
			username_obj,
			gender_obj,
			tanggal_lahir_obj,
			email_obj,
			phone_obj,
			alamat_baris_1_obj,
			alamat_baris_2_obj,
			alamat_kota_obj,
			alamat_provinsi_obj,
			alamat_daerah_obj,
			alamat_kodepos_obj,
			desc_obj
		] = data;
		// console.log(emailField, passwordField);
		const form = {
			username: username_obj[1],
			gender: gender_obj[1],
			tanggal_lahir: tanggal_lahir_obj[1],
			email: email_obj[1],
			phone: phone_obj[1],
			alamat: {
				baris_1: alamat_baris_1_obj[1],
				baris_2: alamat_baris_2_obj[1],
				kota: alamat_kota_obj[1],
				provinsi: alamat_provinsi_obj[1],
				daerah: alamat_daerah_obj[1],
				kodepos: alamat_kodepos_obj[1]
			},
			desc: desc_obj[1]
		};
		console.log(form);
		// if (!email) {
		// 	return {
		// 		status: 404,
		// 		body: { errors: 'Email is not valid!' }
		// 	};
		// }
		// if (!password) {
		// 	return {
		// 		status: 404,
		// 		body: { errors: 'Password is not valid!' }
		// 	};
		// }

		// // throw redirect(302, '/');
		// throw redirect(307, '/');
	}
};
