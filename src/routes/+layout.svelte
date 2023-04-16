<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import Search from 'svelte-search';
	import { goto } from '$app/navigation';
	import type { strikeNotif } from '$lib/strikes';
	import type { LayoutData } from './$types';
	
	//Comment these out when running locally, analytics break the dev server
	// import { inject } from '@vercel/analytics';
	// import { dev } from '$app/environment';
	// inject({ mode: dev ? 'development' : 'production' });
	
	export let data: LayoutData;

	let drawerVisible = false;
	let manualTheme = '';

	const DARK = 'night';
	const LIGHT = 'customLight';

	let toggleStrikePopup = false;
	let strike: strikeNotif;

	let stopCodeSearch: string;

	onMount(async() => {
		const stored = window.localStorage.getItem('theme');	//Save theme from local storage

		if(stored != null) updateTheme(stored);		//If a theme is saved switch to it
		else if (window.matchMedia('(prefers-color-scheme: dark)').matches) updateTheme(DARK)	//If the user prefers dark mode swap to dark (only if nothing is saved)

		const strikes = await data.strike.promise;	//Await promise passed by load function
		const lastNotif = window.localStorage.getItem('lastNotifiedStrike');	//Get last notification sent from local storage

		if(strikes !== null){
			if (lastNotif === null) {	//If no notification has been sent, notify the earliest strike
				strike = strikes[0];
				toggleStrikePopup = true;
			}
			else {
				const lastNotifNum = Number.parseInt(lastNotif);
				for(const strikeEl of strikes){
					if(strikeEl.date.valueOf() > lastNotifNum){	//Notify the earliest strike after the last notification sent
						strike = strikeEl;
						toggleStrikePopup = true;
					}
				}
			}
		}
	})

	//Open or close the drawer (mobile)
	function toggleDrawer() { drawerVisible = !drawerVisible; }

	//Changee theme and save it to the local store
	function updateTheme(val: string){
		manualTheme = val;
		window.localStorage.setItem('theme', val);
	}

	//Send a popup if there's an imminent strike
	function notifSeen(strike: strikeNotif){
		const d = strike.date.valueOf();
		window.localStorage.setItem('lastNotifiedStrike', d.toString());
	}

	//Search a stop by its code
	function searchStop(stop: string){
		toggleDrawer();			//Close the drawer
		stopCodeSearch = '';	//Reset the search string
		goto(`/stop/${stop}`);	//Move to the requested stop page
	}
</script>

<svelte:head>
	<!-- COMMON TAGS -->
	<meta charset="utf-8">
	<title>GTTTools: infomobilità reinventata</title>
	<!-- Search Engine -->
	<meta name="description" content="Un nuovo modo per vivere i mezzi pubblici nella Città di Torino e in Piemonte. Una soluzione moderna per l'infomobilità: semplice, veloce e pensato per le esigenze dei pendolari">
	<meta name="image" content="https://tools.gtt.cx/maskable_icon_x1065.png">
	<!-- Schema.org for Google -->
	<meta itemprop="name" content="GTTTools">
	<meta itemprop="description" content="Un nuovo modo per vivere i mezzi pubblici nella Città di Torino e in Piemonte. Una soluzione moderna per l'infomobilità: semplice, veloce e pensato per le esigenze dei pendolari">
	<meta itemprop="image" content="https://tools.gtt.cx/maskable_icon_x1065.png">
	<!-- Twitter -->
	<meta name="twitter:card" content="summary">
	<meta name="twitter:title" content="GTTTools">
	<meta name="twitter:description" content="Un nuovo modo per vivere i mezzi pubblici nella Città di Torino e in Piemonte. Una soluzione moderna per l'infomobilità: semplice, veloce e pensato per le esigenze dei pendolari">
	<meta name="twitter:image:src" content="https://tools.gtt.cx/maskable_icon_x1065.png">
	<!-- Open Graph general (Facebook, Pinterest & Google+) -->
	<meta name="og:title" content="GTTTools">
	<meta name="og:description" content="Un nuovo modo per vivere i mezzi pubblici nella Città di Torino e in Piemonte. Una soluzione moderna per l'infomobilità: semplice, veloce e pensato per le esigenze dei pendolari">
	<meta name="og:image" content="https://tools.gtt.cx/maskable_icon_x1065.png">
	<meta name="og:url" content="https://tools.gtt.cx">
	<meta name="og:site_name" content="GTTTools">
	<meta name="og:locale" content="it_IT">
	<meta name="og:type" content="website">
</svelte:head>

<div class="drawer" data-theme={manualTheme}>
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
				{#if manualTheme === DARK}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="btn btn-square btn-ghost"
						on:click={() => { updateTheme(LIGHT) }}
					>
						<i class="bx bx-sun bx-sm" />
					</div>
				{:else}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="btn btn-square btn-ghost"
						on:click={() => { updateTheme(DARK) }}
					>
						<i class="bx bx-moon bx-sm" />
					</div>
				{/if}
			</div>
		</nav>

		<div class="lg:flex lg:flex-row min-h-[80vh]">
			<ul class="hidden lg:block menu p-4 w-80 bg-base-300 text-base-content -mt-16">
				<li>
					<a href="/stop/search" data-sveltekit-preload-data>Cerca fermata</a>
				</li>
				<li>
					<a href="/stop/gps" data-sveltekit-preload-data>Fermate vicine</a>
				</li>
				<li>
					<a href="/route/search" data-sveltekit-preload-data>Cerca linea</a>
				</li>
				<li>
					<a href="/vehicle/search" data-sveltekit-preload-data>Trova veicolo</a>
				</li>
				<li>
					<a href="/metro/search" data-sveltekit-preload-data>Stazioni metro</a>
				</li>
				<li>
					<a href="/sfm/search" data-sveltekit-preload-data>Stazioni SFM</a>
				</li>
				<li>
					<a href="/strikes" data-sveltekit-preload-data>Scioperi in programma</a>
				</li>
			</ul>

			<div class="lg:mx-4 mt-2 lg:w-full">
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
				<Search
					hideLabel
					placeholder="Cerca codice fermata"
					class="input input-bordered rounded-2xl w-full max-w-xs -ml-2"
					bind:value={stopCodeSearch}
					on:submit={() => searchStop(stopCodeSearch)}
					inputmode="numeric"
				/>
			</li>
			<li>
				<a href="/stop/search" data-sveltekit-preload-data on:click={toggleDrawer}>Cerca fermata</a>
			</li>
			<li>
				<a href="/stop/gps" data-sveltekit-preload-data on:click={toggleDrawer}>Fermate vicine</a>
			</li>
			<li>
				<a href="/route/search" data-sveltekit-preload-data on:click={toggleDrawer}>Cerca linea</a>
			</li>
			<li>
				<a href="/vehicle/search" data-sveltekit-preload-data on:click={toggleDrawer}>Trova veicolo</a>
			</li>
			<li>
				<a href="/metro/search" data-sveltekit-preload-data on:click={toggleDrawer}>Stazioni metro</a>
			</li>
			<li>
				<a href="/sfm/search" data-sveltekit-preload-data on:click={toggleDrawer}>Stazioni SFM</a>
			</li>
			<li>
				<a href="/strikes" data-sveltekit-preload-data on:click={toggleDrawer}>Scioperi in programma</a>
			</li>
		</ul>
	</div>
	
	{#if strike !== undefined}
		<input type="checkbox" id="strike-modal" class="modal-toggle" bind:checked={toggleStrikePopup}/>
		<div class="modal modal-bottom sm:modal-middle">
			<div class="modal-box">
				<h3 class="font-bold text-lg">Attenzione! Possibile sciopero</h3>
				<p class="mt-4 -mb-2">È in programma uno sciopero <span class="font-mono">{strike.sector.toLowerCase()}</span> per il giorno <span class="font-mono">{strike.date.toLocaleDateString()}</span>.</p>
				<p class="mt-4 -mb-2">Maggiori informazioni disponibili alla <a class="link" href="/strikes" on:click={() => toggleStrikePopup = false}>pagina degli scioperi</a>.</p>
				<div class="modal-action">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div class="btn mx-auto btn-wide"
						on:click={() => {toggleStrikePopup = false; notifSeen(strike);}}
					>
					Capito
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
