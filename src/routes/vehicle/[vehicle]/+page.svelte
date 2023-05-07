<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import Counter from './counter.svelte';
	import type { PageServerData } from './$types';
	import type { vehicleSearched } from '$lib/vehicle';

	export let data: PageServerData;

	let dots = '...'
	setInterval(() => {
		if(dots.length !== 3) dots+='.';
		else dots = '';
	}, 500);

	let api: vehicleSearched | null;

	//Create dummy promise to use sveltekit's #await block
	const container: Function[] = [];
	const loader = new Promise((resolve, reject) => {
		container.push(resolve);
	})

	//Refresh data every 5 seconds
	onMount(async () => {
		api = await data.route.promise	//First refresh the data
		container[0]();	//Once data has been loaded for the first time, resolve dummy promise
		setInterval(async () => {
			await invalidate('vehicle');		//Wait for page reload
			api = await data.route.promise		//Then refresh the data
		}, 5000);
	});

	//Fetch an image. Proxy the request if it comes from a remote host
	function getImage(uri: string){
		if(!uri.includes('http')) return uri;
		return `/api/image?url=${uri}`;
	}
</script>

<svelte:head>
	<title>Informazioni sul veicolo {data.code}</title>
	<meta name="description" content="Informazioni, immagine e posizione in tempo reale del veicolo numero {data.code}. Possibilità di seguirlo e osservare la linea su cui è in servizio. Sono disponibili informazioni riguardo a bus, autosnodati, tram e treni">
</svelte:head>


<div class="w-full mx-auto px-2">
	<h1 class="text-xl mb-2">
		Veicolo numero {data.code}
	</h1>

	<div class="w-fit mx-auto">
		<img src={getImage(data.url)} alt="Veicolo numero {data.code}" class="max-h-96"/>
		<span class="text-sm italic">
			Foto a cura di {data.credits} tramite <a class="link" target="_blank" rel="noopener noreferrer" href={data.creditsLink}>{data.creditsSiteName}</a>
		</span>
	</div>

	{#if data.info !== null}
		<div class="mt-4 mb-6">
			Maggiori informazioni e schede tecniche sul sito di <a class="link" target="_blank" rel="noopener noreferrer" href={data.info}>Tram di Torino</a>.
		</div>
	{/if}

	<div class="mb-16 mt-3">
		{#await loader}
				<div class="mx-auto pt-44 w-fit text-center">
					<i class='bx bx-loader-circle bx-spin text-8xl'/>
					<div class="w-48 mt-4 text-xl font-light">Ricerca informazioni in tempo reale{dots}</div>
				</div>
		{:then _} 
			<h2 class="text-lg mb-1.5">Informazioni in tempo reale</h2>
			{#if api === null}
				Nessuna informazione in tempo reale disponibile
			{:else}
				<ul>
					<li>In servizio sulla linea: <span class="font-mono">{api.route}</span></li>
					<li>Posizione: <span class="font-mono">{api.lat.toFixed(5)};{api.lon.toFixed(5)}</span> </li>
					<li>Aggiornato:  <span class="font-mono"> <Counter time={api.updated}/></span> <li>
				</ul>
			{/if}
		{/await}
	</div>
</div>
