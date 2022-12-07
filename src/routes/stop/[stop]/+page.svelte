<script lang="ts">
	import type { PageData } from './$types';

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
</script>

<h1 class="mb-4 font-bold">Stop {data.code}</h1>
<div class="my-4">
	<p>Stop data</p>
	<p>Name: {data.db.name}</p>
	<p>Description: {data.db.description}</p>
	<p>Lat: {data.db.coordinates.lat}</p>
	<p>Lon: {data.db.coordinates.lon}</p>
</div>
{#each data.api as pass}
	<div class="my-1">
		<p>Route {pass.line}</p>
		{#each pass.realTime as time}
			<p>{printLocale(time)}</p>
		{/each}
	</div>
{/each}
