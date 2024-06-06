<script lang="ts">
	import Search from 'svelte-search';
	import type { stopDB } from '$lib/stopDB';
	import type { PageServerData } from './$types';
	import { invalidate, preloadData } from '$app/navigation';
	import { onMount } from 'svelte';
	import { seo } from "$lib/stores/seo";
	
	export let data: PageServerData;

	$seo.title = "Ricerca stazioni ferroviarie";
	$seo.description = "Cerca una stazione ferroviaria di Torino per visualizzare i passaggi dei prossimi treni treni Regionali, Regionali Veloci e del Servizio Ferroviario Metropolitano";

	let value = '';
	$: stops = data.db;
	onMount(preload);

	async function searchDB(stop: string) {
		if (stop.length > 0) {
			const res = await fetch(`/api/search-stop/${stop}?filter=sfm`);
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
		if (stops.length > 0) return preloadData(`/sfm/${stops[0].trainCode}`);
	}
</script>

<div class="form-control w-full max-w-xs mx-auto lg:mx-0">
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label class="label">
		<span class="label-text">Inserisci il nome di una stazione</span>
	</label>
	<Search
		label=""
		placeholder="Cerca"
		bind:value
		on:type={() => searchDB(value)}
		on:clear={() => invalidate('search').then(preload)}
		class="input input-bordered w-full max-w-xs"
	/>
</div>

<div class="mx-4 lg:mx-auto py-2 lg:grid lg:grid-cols-2 lg:gap-x-4">
	{#if stops != undefined}
		{#each stops as stop}
			<a class="my-1 card card-compact bg-base-200 btn h-fit animate-none" href="/sfm/{stop.trainCode}">
				<div class="card-body w-full grid">
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
