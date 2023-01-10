<script lang="ts">
	import '../app.css';
	// Import the functions you need from the SDKs you need
	import { initializeApp } from 'firebase/app';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { getAnalytics } from 'firebase/analytics';
	import { firebaseConfig } from './../auth/firebase.config';
	import { onMount } from 'svelte';
	import { logout } from './../auth/authStores';
	// TODO: Add SDKs for Firebase products that you want to use
	// https://firebase.google.com/docs/web/setup#available-libraries

	// Initialize Firebase

	let userUID: any = '';
	onMount(() => {
		const app = initializeApp(firebaseConfig);
		const analytics = getAnalytics(app);
		const auth = getAuth();
		
		onAuthStateChanged(auth, (user) => {
			if (user) {
				// User is signed in, see docs for a list of available properties
				// https://firebase.google.com/docs/reference/js/firebase.User
				const uid = user.uid;
				// ...
				// console.log(user);
				userUID = user.uid;
				// console.log(user.uid);
			} else {
				// User is signed out
				// ...
				// console.log('belum login');
				userUID = '';
			}
		});
	});

	let showDotMenu = false;
</script>

<nav class="h-11 bg-violet-500 text-white flex justify-between pl-5">
	<a href="/" class="text-white h-11 flex items-center"
		><span class="font-semibold text-xl">Gol D. Jewel</span></a
	>
	<div class="relative">
		<div class="h-11 flex items-center px-2">
			<svg
				on:click={() => (showDotMenu = !showDotMenu)}
				on:keyup={() => (showDotMenu = !showDotMenu)}
				xmlns="http://www.w3.org/2000/svg"
				fill="white"
				viewBox="0 0 24 24"
				stroke-width="3"
				stroke="currentColor"
				class="w-8 h-8 text-white cursor-pointer"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
				/>
			</svg>
		</div>
		{#if showDotMenu}
			<ul
				class="absolute top-9 right-2 w-48 bg-white text-slate-700 rounded shadow drop-shadow z-50"
			>
				{#if userUID === 'B5hrh2ZsjZTTsv2LpH7T15116fG3'}
					<li>
						<a
							on:click={() => (showDotMenu = false)}
							href="/register"
							class="flex items-center h-11 w-48 px-5 hover:bg-slate-100 rounded-t"
							>Register New User</a
						>
					</li>
				{/if}
				{#if userUID !== ''}
					<li>
						<button
							on:click={logout}
							on:click={() => (showDotMenu = false)}
							class="flex items-center h-11 w-48 px-5 hover:bg-slate-100 rounded-b"
						>
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
									d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
								/>
							</svg>
							<span class="ml-1">Logout</span></button
						>
					</li>
				{:else}
					<li>
						<a
							on:click={() => (showDotMenu = false)}
							href="/login"
							class="flex items-center h-11 w-48 px-5 hover:bg-slate-100 rounded-b">Login</a
						>
					</li>
				{/if}
			</ul>
		{/if}
	</div>
</nav>

<main class="text-slate-700">
	<slot />
</main>
