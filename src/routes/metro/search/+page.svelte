<script lang="ts">
	import Search from 'svelte-search';
	import type { stopDB } from '$lib/stopDB';
	import fetch from '$lib/proxyRequest';
	import type { PageServerData } from './$types';
	
	export let data: PageServerData;

	let value = '';
	let stops = data.db;

	async function searchDB(stop: string) {
		if (stop.length > 0) {
			const res = await fetch(`/api/search-stop/${stop}?filter=metro`);
			stops = await res.json();
		}
	}

	function checkCity(stop: stopDB) {
		if (stop.city === undefined) return false;
		if (stop.city === 'TORINO') return false;
		if (stop.description != undefined) if (stop.description.includes(stop.city)) return false;
		if (stop.name.includes(stop.city)) return false;

		return true;
	}
</script>

<svelte:head>
	<title>Ricerca stazioni metro</title>
	<meta name="description" content="Pagina di ricerca per le stazioni della metropolitana di Torino. Possibilità di visualizzare i prossimi passaggi dei treni in tempo reale">
</svelte:head>

<div class="form-control w-full max-w-xs mx-auto lg:mx-0">
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label class="label">
		<span class="label-text">Inserisci il nome di una stazione</span>
	</label>
	<Search
		label=""
		placeholder="Cerca"
		autofocus
		bind:value
		on:type={() => searchDB(value)}
		class="input input-bordered w-full max-w-xs"
	/>
</div>

<div class="mx-4 lg:mx-auto py-2 lg:grid lg:grid-cols-2 lg:gap-x-4">
	{#if stops != undefined}
		{#each stops as stop}
			<a
				class="my-1 card card-compact bg-base-200 btn h-fit animate-none"
				href="/metro/{stop.code}"
				data-sveltekit-preload-data
			>
				<div class="card-body w-full grid grid-cols-1">
					<span class="text-primary card-title">{stop.name}</span>
					{#if stop.description != undefined && stop.description != stop.name}
						<span class="text-xs italic place-self-start">{stop.description}</span>
					{/if}
					{#if checkCity(stop)}
						<span class="text-xs italic place-self-start">{stop.city}</span>
					{/if}
				</div>
			</a>
		{/each}
	{/if}
</div>
