<script lang="ts">
	import Search from 'svelte-search';
	import type { stopDB } from '$lib/stopDB';
	import { preloadData } from '$app/navigation';
	import { favourites } from '$lib/favourites/favouriteStops';
	import { onMount } from 'svelte';

	let value = '';
	$: favouriteStops = new Array<stopDB>();
	$: stops = new Array<stopDB>();

	onMount(async () => {
		const fav = Array.from($favourites);
		if (fav.length === 0) return;

		const res = await fetch(`/api/bulk-stop/${fav}`);
		favouriteStops = await res.json();
	});

	async function searchDB(stop: string) {
		if (stop.length > 0) {
			const res = await fetch(`/api/search-stop/${stop}`);
			stops = await res.json();
			await preload();
		}
	}

	function checkCity(stop: stopDB) {
		if (stop.city === undefined) return false;
		if (stop.city === 'TORINO') return false;
		if (stop.description != undefined) if (stop.description.includes(stop.city)) return false;
		if (stop.name.includes(stop.city)) return false;

		return true;
	}

	function preload() {
		if (stops.length > 0) return preloadData(`/metro/${stops[0].code}`);
	}
</script>

<svelte:head>
	<title>Ricerca fermate mezzi pubblici</title>
	<meta name="description" content="Pagina di ricerca per le fermate dei mezzi pubblici di Torino. Possibilità di visualizzare i prossimi passaggi delle linee in tempo reale" />
</svelte:head>

<div class="form-control w-full max-w-xs mx-auto lg:mx-0">
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label class="label">
		<span class="label-text">Inserisci il nome o il codice di una fermata</span>
	</label>
	<Search label="" placeholder="Cerca" bind:value on:type={() => searchDB(value)} class="input input-bordered w-full max-w-xs" />
</div>

<div class="mx-4 lg:mx-auto py-2 lg:grid lg:grid-cols-2 lg:gap-x-4">
	{#if favouriteStops.length > 0 && value.length === 0}
		<span class="col-span-full text-sm">Fermate preferite:</span>
		{#each favouriteStops as stop}
			<a class="my-1 card card-compact bg-base-200 btn h-fit animate-none" href="/stop/{stop.code}">
				<div class="card-body w-full grid grid-cols-4">
					<span class=" text-primary col-span-3 card-title">{stop.name}</span>
					<span class="text-secondary py-1"> {stop.code ?? ''}</span>
					{#if stop.description != undefined && stop.description != stop.name}
						<span class="col-span-4 text-xs italic place-self-start">{stop.description}</span>
					{/if}
					{#if checkCity(stop)}
						<span class="col-span-4 text-xs italic place-self-start">{stop.city}</span>
					{/if}
				</div>
			</a>
		{/each}
	{/if}
</div>

<div class="mx-4 lg:mx-auto py-2 lg:grid lg:grid-cols-2 lg:gap-x-4">
	{#if stops != undefined && value.length > 0}
		{#each stops as stop}
			<a class="my-1 card card-compact bg-base-200 btn h-fit animate-none" href="/stop/{stop.code}">
				<div class="card-body w-full grid grid-cols-4">
					<span class=" text-primary col-span-3 card-title">{stop.name}</span>
					<span class="text-secondary py-1"> {stop.code ?? ''}</span>
					{#if stop.description != undefined && stop.description != stop.name}
						<span class="col-span-4 text-xs italic place-self-start">{stop.description}</span>
					{/if}
					{#if checkCity(stop)}
						<span class="col-span-4 text-xs italic place-self-start">{stop.city}</span>
					{/if}
				</div>
			</a>
		{/each}
	{/if}
</div>
