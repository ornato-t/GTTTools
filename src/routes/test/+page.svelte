<script lang="ts">
	import type { vehicle } from '$lib/vehicle';
	import type { stop } from '$lib/stop';

	async function getVehicle(route: string) {
		const line = await fetch(`/proxy/route/${route}`);
		const data = await line.json();
		return data as vehicle[];
	}

	async function getStop(stop: number) {
		const station = await fetch(`/proxy/stop/${stop}`);
		const data = await station.json();
		return data as stop[];
	}

	function printDate(d: Date[]) {
		const dates = d.map((el) => printLocale(el));
		return dates;
	}

	function printLocale(d: Date) {
		d = new Date(d);
		return `${d.getHours()}:${d.getMinutes()}`;
	}

	const pollingRoute = '10';
	const pollingStop = 27;
	const vehicle: Promise<vehicle[]> = getVehicle(pollingRoute);
	const stop: Promise<stop[]> = getStop(pollingStop);
</script>

<div class="text-red-600">Tailwind works</div>
<div class="btn">DaisyUI works</div>
<div>
	<h1 class="text-xl">GTTTools works</h1>
	<div>
		<span class="font-bold"> Line {pollingRoute} </span>
		<!-- svelte-ignore empty-block -->
		{#await vehicle then route}
			{#each route as vehicle}
				<div class="my-2">
					<p>ID: {vehicle.id}</p>
					<p>Direction: {vehicle.direction}</p>
					<p>Latitude: {vehicle.lat}</p>
					<p>Longitude: {vehicle.lon}</p>
					<p>Type: {vehicle.vehicleType}</p>
					<p>Last update: {printLocale(vehicle.updated)}</p>
				</div>
			{/each}
		{/await}
	</div>
	<div class="mt-6">
		<span class="font-bold">Stop {pollingStop}</span>
		<!-- svelte-ignore empty-block -->
		{#await stop then stop}
			{#each stop as passage}
				<div class="my-2">
					<p>Route: {passage.line}</p>
					<p>Route ID: {passage.lineID}</p>
					<p>Destination: {passage.direction}</p>
					<p>Time (real time): {printDate(passage.realTime)}</p>
					<p>Time (programmed): {printDate(passage.programmed)}</p>
				</div>
			{/each}
		{/await}
	</div>
</div>
