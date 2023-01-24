<script lang="ts">
	import type { PageData } from './$types';
	import type { stop } from '$lib/stop';
	import fetch from '$lib/proxyRequest';

	async function getStop(stop: number) {
		const station = await fetch(`/proxy/stop/${stop}`);

		if (station.status !== 200) {
			const err = await station.json();
			console.log(err); //In case of an error it will be detected here. However I can't use a custom loading page, otherwise the thing becomes super slow
			/*
				{
					"message": "GTT API offline",
					"status": 503
				}
			*/
		}

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
			{#if pass.realTime.length > 0}
				<a href="/route/{pass.route}" class="link" data-sveltekit-preload-data>
					<p>Linea {pass.route}</p></a
				>
				{#each pass.realTime as time}
					<p>{printLocale(time)}</p>
				{/each}
			{/if}
		</div>
	{/each}
{/await}
