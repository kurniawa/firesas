// Initialize Cloud Firestore and get a reference to the service
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
	// initializeApp(firebaseConfig);

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
