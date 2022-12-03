<script lang="ts">
	import { Route } from 'gtttools';

	interface vehicle {
		id: number;
		vehicleType: string;
		lat: number;
		lon: number;
		direction: number;
		updated: Date;
	}

	let line: vehicle[];
	let route: string;
	const myRoute = new Route();

	myRoute.poll('10', 1000); //Poll route 4 every 1000 milliseconds
	myRoute.on('refresh', (vehicleData, route) => {
		line = vehicleData;
		route = route;
	});
</script>

<div class="text-red-600">Tailwind works</div>
<div class="btn">DaisyUI works</div>
<div>
	<span>GTTTools works</span>
	<span> Line {route} </span>
	{#if line != undefined}
		{#each line as vehicle}
			{vehicle.vehicleType}
			{vehicle.id}
			{vehicle.lat}
			{vehicle.lon}
		{/each}
	{/if}
</div>
