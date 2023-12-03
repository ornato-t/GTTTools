<script lang="ts">
	import 'leaflet/dist/leaflet.css';
	import type { LatLngExpression, LatLngTuple, Map } from 'leaflet';
	import type { stopDB } from '$lib/stopDB';
	import { placeTiles } from '$lib/map/map';
	import { onMount } from 'svelte';

	export let coords: LatLngExpression;
	export let db: stopDB;
	export let near: stopDB[];

	let mapElement: HTMLElement;
	let map: Map;
	let loaded = false;

	const pinColour = '#1b8ae8';
	const otherPinColour = '#909090';

	onMount(async () => {
		const L = await import('leaflet'); //Leaflet has to be imported here, it needs window to be defined
		const { pinIcon, otherPinIcon } = getPinIcons(L);

		map = L.map(mapElement).setView(coords, 30);
		placeTiles(L, map);

		//Place icon of queried stop
		L.marker(coords, { icon: pinIcon }).addTo(map).bindPopup(getPopup(db));

		//Place icons of nearby stops
		for (const stop of near) {
			L.marker(stop.coordinates as LatLngTuple, { icon: otherPinIcon })
				.addTo(map)
				.bindPopup(getPopup(stop));
		}

		loaded = true;
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

<!-- TODO: needs placing, should be moved over the top right corner of the map. Putting it inside the map makes it non interactable -->
<!-- <button class="btn btn-active btn-accent btn-circle" style="z-index: 2000;">
    <a href="#top">
        <i class='bx bx-up-arrow-alt bx-md' ></i> 
    </a>
</button> -->

<main class="select-none mt-4 mb-3">
	<div bind:this={mapElement} class="h-full" />
</main>

<style>
	main div {
		height: 80vh;
	}
</style>
