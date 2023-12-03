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

	const mainColour = '#1b8ae8';
	const otherColour = '#909090';
	const metroColour = '#d62828';
	const trainColour = '#cea30c';

	onMount(async () => {
		const L = await import('leaflet'); //Leaflet has to be imported here, it needs window to be defined
		const { mainPin, otherPin, metroPin, trainPin } = getPinIcons(L);

		map = L.map(mapElement).setView(coords, 18);
		placeTiles(L, map);

		//Place icon of queried stop
		L.marker(coords, { icon: mainPin }).addTo(map).bindPopup(getPopup(db));

		//Place icons of nearby stops
		for (const stop of near) {
			if (stop.metro)
				L.marker(stop.coordinates as LatLngTuple, { icon: metroPin })
					.addTo(map)
					.bindPopup(getPopup(stop));
			else if (stop.train) {
				L.marker(stop.coordinates as LatLngTuple, { icon: trainPin })
					.addTo(map)
					.bindPopup(getPopup(stop));
			} else {
				L.marker(stop.coordinates as LatLngTuple, { icon: otherPin })
					.addTo(map)
					.bindPopup(getPopup(stop));
			}
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
		const mainPin = L.divIcon({
			html: `<i class='bx bxs-map text-5xl' style='color: ${mainColour}'></i>`,
			iconSize: [20, 20],
			className: ''
		});

		const otherPin = L.divIcon({
			html: `<i class='bx bxs-map text-3xl' style='color: ${otherColour}'></i>`,
			iconSize: [20, 20],
			className: ''
		});

		const metroPin = L.divIcon({
			html: `<i class='bx bxs-map text-3xl' style='color: ${metroColour}'></i>`,
			iconSize: [20, 20],
			className: ''
		});

		const trainPin = L.divIcon({
			html: `<i class='bx bxs-map text-3xl' style='color: ${trainColour}'></i>`,
			iconSize: [20, 20],
			className: ''
		});

		return { mainPin, otherPin, metroPin, trainPin };
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
