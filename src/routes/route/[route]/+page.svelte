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

<h1 class="mb-4 font-bold">Linea {data.code}</h1>
<div class="my-4">
	<p>Nome: {data.db.name}</p>
	<p>Tipo (nominale): {data.db.type}</p>
</div>
{#each data.api as vehicle}
	<div class="my-1">
		<p>ID veicolo: {vehicle.id}</p>
		<p>Tipo: {vehicle.vehicleType}</p>
		<p>Lat: {vehicle.lat}</p>
		<p>Lon: {vehicle.lon}</p>
		<p>Direzione: {vehicle.direction}</p>
		<p>Ultimo aggiornamento: {printLocale(vehicle.updated)}</p>
	</div>
{/each}
