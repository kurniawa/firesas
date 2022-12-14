<script lang="ts">
	import { admin_ids } from './../auth/authStores';
	import { initializeApp } from 'firebase/app';
	import { firebaseConfig } from './../auth/firebase.config';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	initializeApp(firebaseConfig);
	const auth = getAuth();
	let displayName: any = '';
	onAuthStateChanged(auth, (user) => {
		if (user) {
			// User is signed in, see docs for a list of available properties
			// https://firebase.google.com/docs/reference/js/firebase.User
			const uid = user.uid;
			// ...
			// console.log(user.displayName);
			displayName = user.displayName;
			console.log('is_admin:', admin_ids.includes(user.uid));
		} else {
			// User is signed out
			// ...
			// console.log('belum login');
			displayName = '';
		}
	});
	let menus = ['Pembelian', 'Buyback', 'Pelanggan'];
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

{#if displayName !== ''}
	<div class="grid grid-cols-3 gap-2 mx-5 mt-5">
		{#each menus as menu}
			<a
				href="/{menu.toLowerCase()}"
				class="bg-indigo-400 border-4 border-white shadow drop-shadow rounded hover:border-8 hover:bg-emerald-500"
			>
				<div class="flex items-center h-3/4 justify-center">
					<div class="w-2/3 h-2/3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-full h-full text-white"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
							/>
						</svg>
					</div>
				</div>
				<div
					class="font-semibold border-t-4 border-t-white flex h-1/4 justify-center items-center text-white"
				>
					{menu}
				</div>
			</a>
		{/each}
	</div>
{/if}
<div class="mx-8 rounded border mt-5 text-center p-3">
	{#if displayName !== ''}
		<p>User logged in!</p>
		<p>Name: {displayName}</p>
	{:else}
		<p>User is not logged in!</p>
	{/if}
</div>
<!-- <h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p> -->
