<script>
	import { onMount } from 'svelte';
	import '../app.css';

	let drawerVisible = false;
	let manualTheme = '';
	let dark = false;

	onMount(() => {
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) dark = true;
	});

	function toggleDrawer() {
		drawerVisible = !drawerVisible;
	}
</script>

<svelte:head>
	<title>GTTTools</title>
	<link rel="stylesheet" href="https://unpkg.com/boxicons@latest/css/boxicons.min.css" />
</svelte:head>

<div class="drawer" data-theme={manualTheme}>
	<input id="drawer" type="checkbox" class="drawer-toggle" bind:checked={drawerVisible} />
	<div class="drawer-content">
		<nav class="navbar bg-base-100">
			<div class="navbar-start">
				<label for="drawer" class="btn btn-square btn-ghost drawer-button lg:hidden">
					<i class="bx bx-menu-alt-left bx-md" />
				</label>
			</div>
			<div class="navbar-center">
				<a class="btn btn-ghost normal-case text-xl" href="/">
					<img src="/logo-text.png" alt="GTTTools" class="h-10" />
				</a>
			</div>
			<div class="navbar-end">
				{#if dark}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="btn btn-square btn-ghost"
						on:click={() => {
							manualTheme = 'winter';
							dark = !dark;
						}}
					>
						<i class="bx bx-sun bx-sm" />
					</div>
				{:else}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="btn btn-square btn-ghost"
						on:click={() => {
							manualTheme = 'night';
							dark = !dark;
						}}
					>
						<i class="bx bx-moon bx-sm" />
					</div>
				{/if}
			</div>
		</nav>

		<div class="lg:flex lg:flex-row min-h-[60vh] ">
			<ul class="hidden lg:block menu p-4 w-80 bg-base-300 text-base-content">
				<li>
					<a href="/stop/search" data-sveltekit-preload-data>Cerca fermata</a>
				</li>
				<li>
					<a href="/stop/gps" data-sveltekit-preload-data>Fermate vicine</a>
				</li>
				<li>
					<a href="/route/search" data-sveltekit-preload-data>Cerca linea</a>
				</li>
			</ul>

			<div class="mx-4 my-2 lg:w-full">
				<slot />
			</div>
		</div>

		<footer class="footer p-10 bg-neutral text-neutral-content ">
			<div>
				<span class="footer-title">About</span>
				<a class="link link-hover" href="/about/me" data-sveltekit-preload-data>Chi sono</a>
				<a class="link link-hover" href="/about/gtttools" data-sveltekit-preload-data>
					Perché GTTTools?
				</a>
				<a
					class="link link-hover"
					href="https://github.com/ornato-t/GTTTools"
					data-sveltekit-preload-data
				>
					GitHub
				</a>
			</div>
			<div>
				<span class="footer-title">Note legali</span>
				<a class="link link-hover" href="/about/privacy" data-sveltekit-preload-data>Privacy</a>
				<a class="link link-hover" href="/about/data" data-sveltekit-preload-data>Dati</a>
			</div>
		</footer>
	</div>
	<div class="drawer-side">
		<label for="drawer" class="drawer-overlay" />
		<ul class="menu p-4 w-80 bg-base-100 text-base-content">
			<li>
				<a href="/stop/search" data-sveltekit-preload-data on:click={toggleDrawer}>Cerca fermata</a>
			</li>
			<li>
				<a href="/stop/gps" data-sveltekit-preload-data on:click={toggleDrawer}>Fermate vicine</a>
			</li>
			<li>
				<a href="/route/10" data-sveltekit-preload-data on:click={toggleDrawer}>Cerca linea</a>
			</li>
		</ul>
	</div>
</div>
