<script lang="ts">
	import 'leaflet/dist/leaflet.css';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import type { PageData } from './$types';
	import type { LatLngTuple, Map } from 'leaflet';
	import type { stopDB } from '$lib/stopDB';
	import { placeTiles } from '$lib/map';

	export let data: PageData;

	const coords = data.coords;

	let mapElement: HTMLElement;
	let map: Map;
	let loaded = false;

	const pinColour = '#1b8ae8';
	const otherPinColour = '#909090';
	const REFRESH_TIME = 1000;

	onMount(async () => {
		const L = await import('leaflet'); //Leaflet has to be imported here, it needs window to be defined
		await import('leaflet-rotatedmarker');

		const { pinIcon, otherPinIcon } = getPinIcons(L);

		map = L.map(mapElement).setView(coords, 30);
		placeTiles(L, map);

		//Place icon of queried stop
		L.marker(coords, { icon: pinIcon }).addTo(map).bindPopup(getPopup(data.db));

		//Place icons of nearby stops
		for (const stop of data.near) {
			L.marker(stop.coordinates as LatLngTuple, { icon: otherPinIcon })
				.addTo(map)
				.bindPopup(getPopup(stop));
		}

		loaded = true;

		//Refresh vehicles positions
		setInterval(() => invalidate('stop_lines'), REFRESH_TIME);
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
	function getPinIcons(L: any) {
		const pinIcon = L.divIcon({
			html: `<i class='bx bxs-map text-5xl' style='color: ${pinColour}'></i>`,
			iconSize: [20, 20],
			className: ''
		});

		const otherPinIcon = L.divIcon({
			html: `<i class='bx bxs-map text-3xl' style='color: ${otherPinColour}'></i>`,
			iconSize: [20, 20],
			className: ''
		});

		return { pinIcon, otherPinIcon };
	}
</script>

<div class="p-4 lg:grid lg:grid-cols-2" id="top">
	<h1 class="mb-4 text-xl font-semibold uppercase">{data.code} - {data.db.name}</h1>
	<h2 class="font-light order-3">{data.db.description ?? ''}</h2>

	<!-- Back button desktop -->
	<a class="hidden lg:inline-flex btn btn-primary rounded-lg ml-3 w-fit place-self-end" href="/stop/{data.code}"><i class="bx bx-arrow-back bx-sm mr-2" />Torna ai passaggi</a>
</div>

<!-- Back button mobile -->
<a class="lg:hidden inline-flex btn btn-primary place-self-start rounded-lg ml-3" href="/stop/{data.code}"><i class="bx bx-arrow-back bx-sm mr-2" />Torna ai passaggi</a>

<!-- TODO: needs placing, should be moved over the top right corner of the map. Putting it inside the map makes it non interactable -->
<!-- <button class="btn btn-active btn-accent btn-circle" style="z-index: 2000;">
    <a href="#top">
        <i class='bx bx-up-arrow-alt bx-md' ></i> 
    </a>
</button> -->

<main class="select-none mb-3">
	<div bind:this={mapElement} class="h-full" />
</main>

<style>
	main div {
		height: 80vh;
	}
</style>
