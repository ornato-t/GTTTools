<script lang="ts">
	import 'leaflet/dist/leaflet.css';
	import Counter from './counter.svelte';
	import Loading from './loading.svelte';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import type { Marker, LatLngTuple, Map } from 'leaflet';
	import type { PageData } from './$types';
	import type { stopDB } from '$lib/stopDB';
	import { placeTiles } from '$lib/map/map';
	import type { vehicle } from '$lib/vehicle';

	export let data: PageData;

	let numVehicles = -1;
	let api = new Array<vehicle>();

	let mapElement: HTMLElement;
	let map: Map;
	const markers = new Array<{ droplet: Marker; vehicle: Marker; code: number }>();

	const vehicleColour = '#1cbb10';
	const REFRESH_TIME = 1000;
	let dots = '';
	let dotsHandle = setInterval(() => {
		if(dots.length > 3) dots = '';
		else dots += '.';
	}, 300);

	onMount(async () => {
		api = await data.api.promise;
		numVehicles = api.length;
		clearInterval(dotsHandle);

		if (data.routes.length === 0) return; //TODO: find a cleaner solution to handle this. Without routes (outdated trips DB) we can't draw the shape but we still can put the icons on the map
		const L = await import('leaflet'); //Leaflet has to be imported here, it needs window to be defined
		await import('leaflet-rotatedmarker');
		// @ts-ignore
		await import('leaflet-polylineoffset'); //This is not an error

		map = L.map(mapElement);
		placeTiles(L, map);

		for (const route of data.routes) {
			const pinIcon = getPinIcon(L, route.pinColour);

			//Draw shape and center the map around it
			const shape = L.polyline(route.shape as LatLngTuple[], { color: route.shapeColour, offset: 5 }).addTo(map); //This is not an error, see plugin
			map.fitBounds(shape.getBounds());

			//Wait for stops data, then place icons of nearby stops
			route.stops.promise.then((stops) => {
				for (const stop of stops) {
					L.marker(stop.coordinates as LatLngTuple, { icon: pinIcon })
						.addTo(map)
						.bindPopup(getPopup(stop));
				}
			});
		}

		//Place vehicle icons
		const { busIcon, tramIcon, dropletIcon } = getVehicleIcons(L, vehicleColour);
		for (const vehicle of api) {
			const vehicleIcon = vehicle.vehicleType === 'Tram' ? tramIcon : busIcon;
			const popup = `<a href="/vehicle/${vehicle.id}"><div>${vehicle.vehicleType} ${vehicle.id}</div></a>`;

			const dropletMark = L.marker([vehicle.lat, vehicle.lon], {
				icon: dropletIcon,
				zIndexOffset: 100,
				alt: vehicle.vehicleType + ' ' + vehicle.id,
				rotationAngle: vehicle.direction
			})
				.addTo(map)
				.bindPopup(popup);

			const vehicleMark = L.marker([vehicle.lat, vehicle.lon], { icon: vehicleIcon, zIndexOffset: 101 }).addTo(map).bindPopup(popup);

			markers.push({
				droplet: dropletMark,
				vehicle: vehicleMark,
				code: vehicle.id
			});
		}

		//Refresh vehicles positions
		setInterval(async () => {
			await invalidate('vehicle'); //Wait for page reload
			api = await data.api.promise; //Then refresh the data
			numVehicles = api.length;
			for (const vehicle of api) {
				for (const marker of markers) {
					if (marker.code === vehicle.id) {
						marker.droplet.setLatLng([vehicle.lat, vehicle.lon]);
						marker.vehicle.setLatLng([vehicle.lat, vehicle.lon]);
						marker.droplet.setRotationAngle(vehicle.direction);
					}
				}
			}
		}, REFRESH_TIME);
	});

	//Return the appropriate popup link for a stop, depending on whether it's a regular stop, metro station or train station
	function getPopup(stop: stopDB) {
		if (stop.metro) {
			return `<a href="/metro/${stop.code}">METRO ${stop.name}</a>`;
		} else if (stop.train) {
			return `<a href="/sfm/${stop.trainCode}">${stop.name} FS</a>`;
		} else {
			return `<a href="/stop/${stop.code}">${stop.code} - ${stop.name}</a>`;
		}
	}

	//Returns a set of leaflet marker icons
	function getPinIcon(L: any, colour: string) {
		const otherPinIcon = L.divIcon({
			html: `<i class='bx bxs-map text-3xl' style='color: ${colour}; transform: translateY(-50%);'></i>`,
			iconSize: [20, 20],
			className: ''
		});

		return otherPinIcon;
	}

	//Return a set of coloured, leaflet marker icons
	function getVehicleIcons(L: any, colour: string) {
		const busIcon = L.divIcon({
			html: `<i class='bx bxs-bus bx-xs' style='color: ${colour}'/>`,
			iconSize: [20, 20]
		});

		const tramIcon = L.divIcon({
			html: `<i class='bx bxs-train bx-xs' style='color: ${colour}'/>`,
			iconSize: [20, 20],
			iconAnchor: [6, 8]
		});

		const dropletIcon = L.divIcon({
			html: `
                <svg viewBox="0 0 31 22" class="h-10 fill-current text-white"stroke="black" stroke-width="0.3">
                    <path d="M12 2.1c-5.5 4.8-6 9.4-6 11.4 0 3.3 2.7 6 6 6s6-2.7 6-6c0-2-.5-6.6-6-11.4z"/>
                </svg>`,
			iconSize: [20, 20],
			iconAnchor: [22.5, 22]
		});

		return { busIcon, tramIcon, dropletIcon };
	}
</script>

<svelte:head>
	<title>Linea {data.db.type.toLowerCase()} {data.code}: informazioni in tempo reale</title>
	<meta name="description" content="Posizioni aggiornate in tempo reale e numero di veicoli in servizio sui {data.db.type.toLowerCase()} della linea {data.code}" />
</svelte:head>

<div class="p-4">
	{#if data.code.toLowerCase() === data.db.type.toLowerCase()}
		<h1 class="mb-4 text-xl font-semibold uppercase">{data.code}</h1>
	{:else}
		<h1 class="mb-4 text-xl font-semibold uppercase">{data.code} - {data.db.type}</h1>
	{/if}
	<h2 class="font-light">{data.db.name}</h2>
</div>

<!-- Desktop -->
<div class="hidden lg:grid grid-cols-4 xl:grid-cols-5 min-[1900px]:grid-cols-6 gap-4 my-2 bg-base-300 p-3 rounded-xl">
	{#if numVehicles > 0}
		<h4 class="font-mono col-span-full">Veicoli in servizio: {numVehicles}</h4>
	{:else if numVehicles === -1}
		<h4 class="font-mono col-span-full">Caricamento in corso{dots}</h4>
	{:else}
		<h4 class="font-mono col-span-full">Nessun veicolo in servizio</h4>
	{/if}

	{#if numVehicles > 0}
		{#key api}
			{#each api as vehicle}
				<a href="/vehicle/{vehicle.id}">
					<div class="card card-compact h-full bg-neutral hover:bg-neutral-focus text-neutral-content shadow-xl">
						<div class="card-body p-6">
							<h2 class="card-title mb-4 grid grid-cols-3">
								<span class="text-xl text-left">{vehicle.id}</span>

								<div class="font-mono text-xs text-end col-span-2">
									<Counter time={vehicle.updated} />
								</div>
							</h2>
						</div>
					</div>
				</a>
			{/each}
		{/key}
	{:else if numVehicles === -1}
		<Loading />
		<Loading />
		<Loading />
		<Loading />
	{:else}
		<div class="font-light px-4">Nessuna informazione in tempo reale disponibile.</div>
	{/if}
</div>

<!-- Mobile -->
<div class="lg:hidden mx-2 rounded-lg collapse collapse-arrow bg-base-300">
	<input type="checkbox" />
	{#if numVehicles > 0}
		<div class="collapse-title font-medium font-mono">Veicoli in servizio: {numVehicles}</div>
	{:else if numVehicles === -1}
		<div class="collapse-title font-medium font-mono">Caricamento in corso...</div>
	{:else}
		<div class="collapse-title font-medium font-mono">Nessun veicolo in servizio</div>
	{/if}

	<div class="collapse-content px-2 grid grid-cols-2 gap-2 place-items-center">
		{#if numVehicles > 0}
			{#key api}
				{#each api as vehicle}
					<div class="card card-compact h-full bg-neutral hover:bg-neutral-focus text-neutral-content shadow-xl">
						<a href="/vehicle/{vehicle.id}">
							<div class="card-body p-6">
								<h2 class="card-title mb-4 grid grid-cols-4">
									<span class="text-xl text-left">{vehicle.id}</span>
									<div class="font-mono text-sm text-end col-span-3">
										<Counter time={vehicle.updated} />
									</div>
								</h2>
							</div>
						</a>
					</div>
				{/each}
			{/key}
		{:else}
			<div class="font-light px-4">Nessuna informazione in tempo reale disponibile.</div>
		{/if}
	</div>
</div>

{#if data.routes.length > 0}
	<main class="select-none my-3">
		<div bind:this={mapElement} class="h-full" />
	</main>
{/if}

<style>
	main div {
		height: 80vh;
	}
</style>
