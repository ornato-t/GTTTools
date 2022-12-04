<script lang="ts">
	import type { vehicle } from '$lib/vehicle';
	import type { stop } from '$lib/stop';

	async function getVehicle(route: string) {
		const line = await fetch(`/api/route/${route}.json`);
		const data = await line.json();
		return data as vehicle[];
	}

	async function getStop(stop: number) {
		const station = await fetch(`/api/stop/${stop}.json`);
		const data = await station.json();
		return data as stop[];
	}

	const vehicle: Promise<vehicle[]> = getVehicle('10');
	const stop: Promise<stop[]> = getStop(25);
</script>

<div class="text-red-600">Tailwind works</div>
<div class="btn">DaisyUI works</div>
<div>
	<span>GTTTools works</span>
	<div>
		<span> Line 10 </span>
		<!-- svelte-ignore empty-block -->
		{#await vehicle then route}
			{#each route as vehicle}
				<div>
					<span>ID: {vehicle.id}</span>
					<span>Direction: {vehicle.direction}</span>
					<span>Latitude: {vehicle.lat}</span>
					<span>Longitude: {vehicle.lon}</span>
				</div>
			{/each}
		{/await}
	</div>
	<br>
	<div>
		<span>Stop Statuto</span>
		<!-- svelte-ignore empty-block -->
		{#await stop then stop}
			{#each stop as passage}
				<div>
					<span>Line: {passage.line}</span>
					<span>Destination: {passage.direction}</span>
					<span>Time: {passage.realTime}</span>
				</div>
			{/each}
		{/await}
	</div>
</div>
