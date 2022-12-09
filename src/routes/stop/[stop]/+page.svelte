<script lang="ts">
	import type { PageData } from './$types';
	import type { stop } from '$lib/stop';
	// import { onMount } from 'svelte/types/runtime/internal/lifecycle';

	// onMount(async () => {
	// 	api = await getStop(data.code)
	// })

	async function getStop(stop: number) {
		const station = await fetch(`https://tools.gtt.cx/proxy/stop/${stop}`);
		// const station = await fetch(`http://localhost:5173/proxy/stop/${stop}`);

		return station.json() as Promise<stop[]>;
	}

	function printLocale(d: Date) {
		const formatter = Intl.DateTimeFormat('it-it', {
			minute: '2-digit',
			hour: '2-digit',
			hour12: false,
			timeZone: 'CET'
		});

		return formatter.format(new Date(d));
	}

	export let data: PageData;
	let api = getStop(data.code);
</script>

<h1 class="mb-4 font-bold">Fermata numero {data.code}</h1>
<div class="my-4">
	<p>Nome: {data.db.name}</p>
	<p>Descrizione: {data.db.description}</p>
	<p>Lat: {data.db.coordinates.lat}</p>
	<p>Lon: {data.db.coordinates.lon}</p>
</div>
{#await api then stop}
	{#each stop as pass}
		<div class="my-1">
			<p>Linea {pass.line}</p>
			{#each pass.realTime as time}
				<p>{printLocale(time)}</p>
			{/each}
		</div>
	{/each}
{/await}
