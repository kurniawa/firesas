<script lang="ts">
	// /** @type {import('./$types').PageData} */
	var userUID = '';
	var email = '';
	var displayName = '';
	var password = '';
	var confirm_password = '';
	var invalid_feedback = '';
	var success = '';
	let isJustRegistered = false;
	// export let data: any;
	// console.log(data);
	import {
		getAuth,
		createUserWithEmailAndPassword,
		updateProfile,
		onAuthStateChanged
	} from 'firebase/auth';
	// console.log(getAuth());
	onMount(() => {
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (user) {
				// User is signed in, see docs for a list of available properties
				// https://firebase.google.com/docs/reference/js/firebase.User
				const uid = user.uid;
				// ...
				// console.log(user);
				userUID = uid;
				// console.log(uid);
				// get();
			} else {
				// User is signed out
				// ...
				// console.log('belum login');
				userUID = '';
			}
		});
	});

	function register() {
		success = '';
		invalid_feedback = '';
		if (password !== confirm_password) {
			invalid_feedback = 'Password and Confirm Password invalid!';
			return false;
		}
		const auth = getAuth();
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Signed in
				const user = userCredential.user;
				// ...
				// console.log(user);
				invalid_feedback = '';
				isJustRegistered = true;
				success = 'New user has been successfully registered!';
				updateProfile(user, {
					displayName: displayName
					// photoURL: 'https://example.com/jane-q-user/profile.jpg'
				})
					.then(() => {
						// Profile updated!
						// ...
						success += ' User displayName updated!';
					})
					.catch((error) => {
						// An error occurred
						// ...
						console.log('updateProfile error:', error);
					});
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				// ..
				console.log('createUserWithEmailAndPassword error:', error);
			});
	}

	import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
	const provider = new GoogleAuthProvider();
	function loginWithGoogle() {
		invalid_feedback = '';
		success = '';
		const auth = getAuth();
		signInWithPopup(auth, provider)
			.then((result) => {
				// This gives you a Google Access Token. You can use it to access the Google API.
				const credential = GoogleAuthProvider.credentialFromResult(result);
				// const token = credential.accessToken;
				// The signed-in user info.
				const user = result.user;
				console.log(user);
				// ...
			})
			.catch((error) => {
				// Handle Errors here.
				const errorCode = error.code;
				const errorMessage = error.message;
				// The email of the user's account used.
				const email = error.customData.email;
				// The AuthCredential type that was used.
				const credential = GoogleAuthProvider.credentialFromError(error);
				// ...
				console.log(errorMessage);
			});
	}

	import { initializeApp } from 'firebase/app';
	import { getFirestore } from 'firebase/firestore';
	import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
	import { firebaseConfig } from './../../auth/firebase.config';
	import { onMount } from 'svelte';

	const app = initializeApp(firebaseConfig);
	const db = getFirestore(app);
	// const customer = collection(db, 'customers');
	const customers = collection(db, 'customers');

	async function getCustomer() {
		// await setDoc(doc(customer, 'customers'), {
		// 	name: 'Amanda Manopo'
		// });
		// console.log(customer);
		const querySnapshot = await getDocs(collection(db, 'customers'));
		querySnapshot.forEach((doc: any) => {
			// doc.data() is never undefined for query doc snapshots
			console.log(doc.id, ' => ', doc.data());
		});
	}
	// getCustomer();
	/**
	 * Ini untuk memfilter mana yang admin, mana yang user_biasa
	 */
	import { admin_ids } from './../../auth/authStores';
	console.log('is_admin:', admin_ids.includes(userUID));
</script>

<svelte:head>
	<title>Register</title>
</svelte:head>

<div class="mx-5 mt-5">
	{#if userUID === 'B5hrh2ZsjZTTsv2LpH7T15116fG3'}
		<form on:submit|preventDefault={register} class="p-5 border rounded border-slate-300">
			<div class="flex justify-center border-b pb-7">
				<h3 class="text-slate-700">Register</h3>
			</div>

			<div class="mt-3">
				<label for="email">Email</label>
				<input
					bind:value={email}
					type="email"
					id="email"
					class="border border-slate-400 text-slate-700 shadow rounded w-full px-3 py-2 block placeholder:text-slate-400 focus:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 invalid:text-pink-700 invalid:focus:ring-pink-700;"
					required
				/>
			</div>

			<div class="mt-3">
				<label for="displayName">Name</label>
				<input
					bind:value={displayName}
					type="test"
					id="displayName"
					class="border border-slate-400 text-slate-700 shadow rounded w-full px-3 py-2 block placeholder:text-slate-400 focus:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 invalid:text-pink-700 invalid:focus:ring-pink-700;"
					required
				/>
			</div>

			<div class="mt-3">
				<label for="password">Password</label>
				<input
					bind:value={password}
					type="password"
					id="password"
					class="border border-slate-400 text-slate-700 shadow rounded w-full px-3 py-2 block placeholder:text-slate-400 focus:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 invalid:text-pink-700 invalid:focus:ring-pink-700;"
					required
				/>
			</div>

			<div class="mt-3">
				<label for="confirm_password">Confirm Password</label>
				<input
					bind:value={confirm_password}
					type="password"
					id="confirm_password"
					class="border border-slate-400 text-slate-700 shadow rounded w-full px-3 py-2 block placeholder:text-slate-400 focus:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 invalid:text-pink-700 invalid:focus:ring-pink-700;"
					required
				/>
			</div>

			{#if invalid_feedback !== ''}
				<div class="invalid-feedback">{invalid_feedback}</div>
			{/if}

			<div class="mt-3 text-center">
				<button type="submit" class="btn-emerald rounded">Register</button>
			</div>
		</form>
		<div class="flex justify-center">
			<button
				on:click={loginWithGoogle}
				class="flex border border-gray-300 font-semibold text-gray-500 rounded py-2 px-3 mt-5 bg-white hover:bg-gray-50"
			>
				<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="w-5"
					><g
						><path
							fill="#EA4335"
							d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
						/><path
							fill="#4285F4"
							d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
						/><path
							fill="#FBBC05"
							d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
						/><path
							fill="#34A853"
							d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
						/><path fill="none" d="M0 0h48v48H0z" /></g
					></svg
				>
				<span class="ml-3"> Sign in with Google </span>
			</button>
		</div>
	{:else}
		{#if isJustRegistered}
			{#if success !== ''}
				<div class="alert-success mt-2">{success}</div>
			{/if}
		{/if}
		<div class="alert-danger mt-2">Warning! Only admin is allowed to register new user!</div>
	{/if}
</div>
