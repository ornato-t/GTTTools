<script lang="ts">
	interface vehicle {
		id: number;
		vehicleType: string;
		lat: number;
		lon: number;
		direction: number;
		updated: Date;
	}

	async function getData(route: string) {
		const line = await fetch(`/api/route/${10}.json`);
		const data = await line.json();
		return data as vehicle[];
	}

	const data: Promise<vehicle[]> = getData('10');
</script>

<div class="text-red-600">Tailwind works</div>
<div class="btn">DaisyUI works</div>
<div>
	<span>GTTTools works</span>
	<span> Line {10} </span>
	<!-- svelte-ignore empty-block -->
	{#await data}
	{:then route}
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
