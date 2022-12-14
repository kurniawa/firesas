// /** @type {import('@sveltejs/kit').Load} */

// // type Egal = {
// //     slug:string
// // }
// export function load({ params }: any) {
// 	params = {
// 		slug: 'exslug'
// 	};
// 	return {
// 		post: {
// 			title: `Title for ${params.slug} goes here`,
// 			content: `Content for ${params.slug} goes here`
// 		}
// 	};
// }
import { redirect } from '@sveltejs/kit';
import { getUser } from './../../auth/authStores';

/** @type {import('./$types').LayoutServerLoad} */
export function load() {
	const user = getUser();
	console.log('register:', user);
	if (user === null) {
		throw redirect(307, '/');
	}
	if (user !== null) {
		if (user.uid !== 'B5hrh2ZsjZTTsv2LpH7T15116fG3') {
			throw redirect(307, '/');
		}
	}
}
