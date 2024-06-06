<script lang="ts">
	import Search from 'svelte-search';
	import { getVehicleType, type routeDB } from '$lib/routeDB';
	import { preloadData } from '$app/navigation';
	import { favourites } from '$lib/stores/favourites/favouriteRoutes';
	import { onMount } from 'svelte';

	let value = '';
	$: favouriteRoutes = new Array<routeDB>();
	$: routes = new Array<routeDB>();

	onMount(async () => {
		const fav = Array.from($favourites);
		if (fav.length === 0) return;

		const res = await fetch(`/api/bulk-route/${fav}`);
		favouriteRoutes = await res.json();
	});

	async function searchDB(route: string) {
		if (route.length > 0) {
			const res = await fetch(`/api/search-route/${route}`);
			routes = await res.json();
			await preload();
		}
	}

	function preload() {
		if (routes.length > 0) return preloadData(`/route/${routes[0].code}`);
	}
</script>

<svelte:head>
	<title>Ricerca fermate mezzi</title>
	<meta name="description" content="Pagina di ricerca per le fermate dei mezzi di Torino. Possibilità di visualizzare i prossimi passaggi in tempo reale" />
</svelte:head>

<div class="form-control w-full max-w-xs mx-auto lg:mx-0">
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label class="label">
		<span class="label-text">Inserisci il codice di una linea o la sua destinazione</span>
	</label>
	<Search label="" placeholder="Cerca" bind:value on:type={() => searchDB(value)} class="input input-bordered w-full max-w-xs" />
</div>

<div class="mx-4 lg:mx-auto py-2 lg:grid lg:grid-cols-2 lg:gap-x-4">
	{#if favouriteRoutes.length > 0 && value.length === 0}
	<span class="col-span-full text-sm">Linee preferite:</span>
		{#each favouriteRoutes as route}
			<a class="my-1 card card-compact bg-base-200 btn h-fit animate-none" href="/route/{route.code.internal}">
				<div class="card-body w-full grid grid-cols-4">
					<span class=" text-primary card-title">{route.code.displayed}</span>
					<span class="text-secondary col-span-3 py-1"> {getVehicleType(route.type.code)} • {route.provider.replace('GTT Servizio ', '')}</span>
					<span class="col-span-4 text-xs italic place-self-start">{route.name}</span>
				</div>
			</a>
		{/each}
	{/if}
</div>

<div class="mx-4 lg:mx-auto py-2 lg:grid lg:grid-cols-2 lg:gap-x-4">
	{#if routes != undefined && value.length > 0}
		{#each routes as route}
			<a class="my-1 card card-compact bg-base-200 btn h-fit animate-none" href="/route/{route.code.internal}">
				<div class="card-body w-full grid grid-cols-4">
					<span class=" text-primary card-title">{route.code.displayed}</span>
					<span class="text-secondary col-span-3 py-1"> {getVehicleType(route.type.code)} • {route.provider.replace('GTT Servizio ', '')}</span>
					<span class="col-span-4 text-xs italic place-self-start">{route.name}</span>
				</div>
			</a>
		{/each}
	{/if}
</div>
