<script lang="ts">
	import '../app.css';
	import Footer from './footer.svelte';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { swipe } from 'svelte-gestures';
	import { page } from '$app/stores';
	import type { strikeNotif } from '$lib/strikes';
	import type { LayoutData } from './$types';
	import { enhance } from '$app/forms';
	import { DARK, theme, toggleTheme } from '$lib/theme';

	export let data: LayoutData;

	let drawerVisible = false;

	let toggleStrikePopup = false;
	let strike: strikeNotif;

	let stopCodeSearch: string;

	onMount(async () => {
		if (!dev) {
			const { inject } = await import('@vercel/analytics');
			inject({ mode: dev ? 'development' : 'production' });
		}

		const strikes = await data.strike.promise; //Await promise passed by load function
		const lastNotif = window.localStorage.getItem('lastNotifiedStrike'); //Get last notification sent from local storage

		if (strikes !== null) {
			if (lastNotif === null) {
				//If no notification has been sent, notify the earliest strike
				strike = strikes[0];
				toggleStrikePopup = true;
			} else {
				const lastNotifNum = Number.parseInt(lastNotif);
				for (const strikeEl of strikes) {
					if (strikeEl.date.valueOf() > lastNotifNum) {
						//Notify the earliest strike after the last notification sent
						strike = strikeEl;
						toggleStrikePopup = true;
					}
				}
			}
		}
	});

	//Open or close the drawer (mobile)
	function toggleDrawer() {
		drawerVisible = !drawerVisible;
	}

	//Send a popup if there's an imminent strike
	function notifSeen(strike: strikeNotif) {
		const d = strike.date.valueOf();
		window.localStorage.setItem('lastNotifiedStrike', d.toString());
	}

	function firstUppercase(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
	}

	//Handles gestures on mobile
	function gestureHandler(event: any) {
		//Ignore slide events on desktop
		const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
		if (isDesktop) return;

		//Ignore slide events on map pages (vehicle and maps). Allow it in vehicle search pages
		const url = $page.url.toString();
		if (url.includes('map') || (url.includes('vehicle') && !url.includes('search'))) return;

		if (event.detail.direction === 'right' && drawerVisible === false) {
			drawerVisible = true;
		}
	}
</script>

<svelte:head>
	<!-- COMMON TAGS -->
	<meta charset="utf-8" />
	<title>GTTTools: infomobilità reinventata</title>
	<!-- Search Engine -->
	<meta
		name="description"
		content="Un nuovo modo per vivere i mezzi pubblici nella Città di Torino e in Piemonte. Una soluzione moderna per l'infomobilità: semplice, veloce e pensato per le esigenze dei pendolari"
	/>
	<meta name="image" content="https://tools.gtt.cx/maskable_icon_x1065.png" />
	<!-- Schema.org for Google -->
	<meta itemprop="name" content="GTTTools" />
	<meta
		itemprop="description"
		content="Un nuovo modo per vivere i mezzi pubblici nella Città di Torino e in Piemonte. Una soluzione moderna per l'infomobilità: semplice, veloce e pensato per le esigenze dei pendolari"
	/>
	<meta itemprop="image" content="https://tools.gtt.cx/maskable_icon_x1065.png" />
	<!-- Twitter -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="GTTTools" />
	<meta
		name="twitter:description"
		content="Un nuovo modo per vivere i mezzi pubblici nella Città di Torino e in Piemonte. Una soluzione moderna per l'infomobilità: semplice, veloce e pensato per le esigenze dei pendolari"
	/>
	<meta name="twitter:image:src" content="https://tools.gtt.cx/maskable_icon_x1065.png" />
	<!-- Open Graph general (Facebook, Pinterest & Google+) -->
	<meta name="og:title" content="GTTTools" />
	<meta
		name="og:description"
		content="Un nuovo modo per vivere i mezzi pubblici nella Città di Torino e in Piemonte. Una soluzione moderna per l'infomobilità: semplice, veloce e pensato per le esigenze dei pendolari"
	/>
	<meta name="og:image" content="https://tools.gtt.cx/maskable_icon_x1065.png" />
	<meta name="og:url" content="https://tools.gtt.cx" />
	<meta name="og:site_name" content="GTTTools" />
	<meta name="og:locale" content="it_IT" />
	<meta name="og:type" content="website" />
</svelte:head>

<div class="drawer" data-theme={$theme} use:swipe={{ timeframe: 300, minSwipeDistance: 60, touchAction: '' }} on:swipe={gestureHandler}>
	<label for="drawer" class="h-0">Apri la barra laterale</label>
	<input id="drawer" type="checkbox" class="drawer-toggle" bind:checked={drawerVisible} />
	<div class="drawer-content">
		<nav class="navbar bg-base-100">
			<div class="navbar-start">
				<!-- Button icon (mobile) -->
				<label for="drawer" class="btn btn-square btn-ghost drawer-button lg:hidden">
					<i class="bx bx-menu-alt-left bx-md" />
				</label>
			</div>
			<div class="navbar-center">
				<a class="btn btn-ghost normal-case text-xl" href="/">
					<img src="/logo-text.webp" alt="GTTTools" width="165" height="40" />
				</a>
			</div>
			<div class="navbar-end">
				{#if $theme === DARK}
					<button class="btn btn-square btn-ghost" on:click={toggleTheme}>
						<i class="bx bx-sun bx-sm" />
					</button>
				{:else}
					<button class="btn btn-square btn-ghost" on:click={toggleTheme}>
						<i class="bx bx-moon bx-sm" />
					</button>
				{/if}
			</div>
		</nav>

		<div class="lg:flex lg:flex-row min-h-[80vh]">
			<ul class="hidden lg:block menu p-4 w-80 bg-base-300 text-base-content -mt-16">
				<li>
					<a href="/stop/search">Cerca fermata</a>
				</li>
				<li>
					<a href="/stop/gps">Fermate vicine</a>
				</li>
				<li>
					<a href="/route/search">Cerca linea</a>
				</li>
				<li>
					<a href="/vehicle/search">Trova veicolo</a>
				</li>
				<li>
					<a href="/metro/search">Stazioni metro</a>
				</li>
				<li>
					<a href="/sfm/search">Stazioni SFM</a>
				</li>
				<li>
					<a href="/strikes">Scioperi in programma</a>
				</li>
			</ul>

			<div class="lg:mx-4 mt-2 lg:w-full">
				<slot />
			</div>
		</div>

		<!-- Hiding footer on home page layout (mobile only), it is added as a child to the list of scrollable elements (see +page.svelte in this dir)-->
		{#if $page.url.pathname === '/'}
			<Footer css={'hidden lg:grid'} />
		{:else}
			<Footer />
		{/if}
	</div>
	<div class="drawer-side">
		<label for="drawer" class="drawer-overlay" />
		<ul class="menu p-4 w-80 bg-base-100 text-base-content">
			<li>
				<form
					method="POST"
					action="/?"
					use:enhance
					on:submit={() => {
						toggleDrawer();
						stopCodeSearch = '';
					}}
				>
					<input
						name="stop"
						placeholder="Cerca codice fermata"
						class="input input-bordered rounded-2xl w-full max-w-xs -ml-2"
						type="text"
						required
						pattern="\d+"
						autocomplete="off"
						autocapitalize="off"
						inputmode="numeric"
						bind:value={stopCodeSearch}
					/>
				</form>
			</li>
			<li>
				<a href="/stop/search" on:click={toggleDrawer}>Cerca fermata</a>
			</li>
			<li>
				<a href="/stop/gps" on:click={toggleDrawer}>Fermate vicine</a>
			</li>
			<li>
				<a href="/route/search" on:click={toggleDrawer}>Cerca linea</a>
			</li>
			<li>
				<a href="/vehicle/search" on:click={toggleDrawer}>Trova veicolo</a>
			</li>
			<li>
				<a href="/metro/search" on:click={toggleDrawer}>Stazioni metro</a>
			</li>
			<li>
				<a href="/sfm/search" on:click={toggleDrawer}>Stazioni SFM</a>
			</li>
			<li>
				<a href="/strikes" on:click={toggleDrawer}>Scioperi in programma</a>
			</li>
		</ul>
	</div>

	{#if strike !== undefined}
		<input type="checkbox" id="strike-modal" class="modal-toggle" bind:checked={toggleStrikePopup} />
		<div class="modal modal-bottom sm:modal-middle">
			<div class="modal-box">
				<h3 class="font-bold text-lg">Attenzione! Possibile sciopero</h3>
				<p class="mt-4 -mb-2">È in programma uno sciopero il giorno <span class="font-mono">{strike.date.toLocaleDateString()}</span>.</p>
				<div class="grid grid-cols-3 mt-6">
					<div>Settore:</div>
					<div class="font-mono text-end col-span-2">{firstUppercase(strike.sector)}</div>
					<div>Ambito:</div>
					<div class="font-mono text-end col-span-2">{firstUppercase(strike.scope)}</div>
				</div>
				<p class="mt-4 -mb-2">Maggiori informazioni alla <a class="link" href="/strikes" on:click={() => (toggleStrikePopup = false)}>pagina degli scioperi</a>.</p>
				<div class="modal-action">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<button
						class="btn mx-auto btn-wide"
						on:click={() => {
							toggleStrikePopup = false;
							notifSeen(strike);
						}}
					>
						Capito
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
