<script lang="ts">
	import 'leaflet/dist/leaflet.css';
	import Counter from './counter.svelte';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import type { Marker, LatLngTuple, Map } from "leaflet";
	import type { stopDB } from '$lib/stopDB';
	import type { vehicleSearched } from '$lib/vehicle';
	import type { PageData } from './$types';

	export let data: PageData;

	let dots = '...'
	const interval = setInterval(() => {
		if(dots.length !== 3) dots+='.';
		else dots = '';
	}, 500);

	let api: vehicleSearched | null;

	let mapElement: HTMLElement;
    let map: Map;
    let marker: {droplet: Marker, vehicle: Marker, code: number};

	const vehicleColour = '#436cdc';
	const pinColour = '#859fe3';
	const shapeColour = '#436cdc';
    const REFRESH_TIME = 5000;

	let loaded = false;

	onMount(async () => {
		const L = await import('leaflet');  //Leaflet has to be imported here, it needs window to be defined
		await import('leaflet-rotatedmarker');
		map = L.map(mapElement);

		api = await data.route.promise	//First refresh the data
		loaded = true	//Once data has been loaded for the first time stop loading animation
		clearInterval(interval);

		if(api !== null) {
			map.setView([api.lat, api.lon], 20);

			//Place map tiles
			L.tileLayer('https://map.gtt.to.it/blossom/{z}/{x}/{y}.png', {
				attribution: 'GTT OpenData | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);

			//Only place stop and shape icons if a matching trip is found
			if(api.db !== null) {
				//Draw shape and center the map around it
				const shape = L.polyline(api.db.shape as LatLngTuple[], {color: shapeColour}).addTo(map);
				map.fitBounds(shape.getBounds());
				
				//Place icons of stops for the current trip
				const pinIcon = getPinIcon(L, pinColour);
				for(const stop of api.db.stops){
					const res = L.marker(stop.coordinates as LatLngTuple, {icon: pinIcon}).addTo(map).bindPopup(getPopup(stop));    
				}
			}

			//Place vehicle icons
			const { busIcon, tramIcon, dropletIcon } = getVehicleIcons(L, vehicleColour);
			const vehicleIcon = (() => {
				if(data.type === 'tram' || data.type === 'tram a cremagliera' || data.type === 'metropolitana') return tramIcon;
				return busIcon;
			})();

			const popup = `<a href="/vehicle/${api.id}"><div>${printType(data.type)} ${api.id}</div></a>`;
			const dropletMark = L.marker([api.lat, api.lon], {icon: dropletIcon, zIndexOffset: 100, alt: api.vehicleType + ' ' + api.id, rotationAngle: api.direction}).addTo(map).bindPopup(popup);
			const vehicleMark = L.marker([api.lat, api.lon], {icon: vehicleIcon, zIndexOffset: 101}).addTo(map).bindPopup(popup);

			marker = {
				droplet: dropletMark,
				vehicle: vehicleMark,
				code: api.id
			};
			
			setInterval(async () => {
				await invalidate('vehicle');		//Wait for page reload
				api = await data.route.promise		//Then refresh the data
				if(api !== null) {
					// map.setView([api.lat, api.lon], 20);	//Only toggle if "follow" is active, TODO: add follow button

					if(marker.code === api.id){
						marker.droplet.setLatLng([api.lat, api.lon]);
						marker.vehicle.setLatLng([api.lat, api.lon]);
						marker.droplet.setRotationAngle(api.direction);
					}
				}
			}, REFRESH_TIME);
		}
	});

	//Fetch an image. Proxy the request if it comes from a remote host
	function getImage(uri: string){
		if(!uri.includes('http')) return uri;
		return `/api/image?url=${uri}`;
	}

	//Returns a string with the first string capitalized
	function printType(str: string){
		return str.charAt(0).toUpperCase() + str.slice(1)
	}

	//Return the appropriate popup link for a stop, depending on whether it's a regular stop, metro station or train station
    function getPopup(stop: stopDB){
        if(stop.metro){
            return `<a href="/metro/${stop.code}">METRO ${stop.name}</a>`;

        } else if (stop.train){
            return `<a href="/sfm/${stop.trainCode}">${stop.name} FS</a>`;
            
        } else {
            return `<a href="/stop/${stop.code}">${stop.code} - ${stop.name}</a>`;
        }
    }

    //Returns a set of leaflet marker icons
    function getPinIcon(L: any, colour: string){
        const icon = L.divIcon({
            html: `<i class='bx bxs-map text-3xl' style='color: ${colour}; transform: translateY(-50%);'></i>`,
            iconSize: [20, 20],
            className: ''
        });

		return icon;
    }

    //Return a set of coloured, leaflet marker icons
    function getVehicleIcons(L: any, colour: string){
        const busIcon = L.divIcon({
            html: `<i class='bx bxs-bus bx-xs' style='color: ${colour}'/>`,
            iconSize: [20, 20],
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

        return {busIcon, tramIcon, dropletIcon}
    }
</script>

<style>
	main div {
		height: 80vh;
	}
</style>

<svelte:head>
	<title>Informazioni sul veicolo {data.code}</title>
	<meta name="description" content="Informazioni, immagine e posizione in tempo reale del veicolo numero {data.code}. Possibilità di seguirlo e osservare la linea su cui è in servizio. Sono disponibili informazioni riguardo a bus, autosnodati, tram e treni">
</svelte:head>		

<div class="w-full mx-auto">
	<h1 class="p-4 mb-4 text-xl font-semibold uppercase">{printType(data.type)} {data.code}</h1>

	<div class="w-fit mx-auto">
		<img src={getImage(data.url)} alt="Veicolo numero {data.code}" class="max-h-96"/>
		<span class="text-sm italic">
			Foto a cura di {data.credits} tramite <a class="link" target="_blank" rel="noopener noreferrer" href={data.link}>{data.siteName}</a>
		</span>
	</div>

	{#if data.info !== null}
		<div class="mt-4 mb-6">
			Maggiori informazioni e schede tecniche sul sito di <a class="link" target="_blank" rel="noopener noreferrer" href={data.info}>Tram di Torino</a>.
		</div>
	{/if}

	<div class="mb-6 mt-3">
		<h2 class="text-lg mb-1.5">Informazioni in tempo reale</h2>
		{#if !loaded}
				<div class="mx-auto pt-44 w-fit text-center">
					<i class='bx bx-loader-circle bx-spin text-8xl'/>
					<div class="w-48 mt-4 text-xl font-light">Ricerca informazioni in tempo reale{dots}</div>
				</div>
		{:else} 
			{#if api !== null}
				<div class="grid grid-cols-2 md:w-1/3">
					<div>In servizio sulla linea:</div>
					<a class="font-mono link" href="/route/{api.route}">{api.route}</a>
					<div>Ultimo aggiornamento: </div>
					<div class="font-mono"> <Counter time={api.updated}/></div>
				</div>
			{:else}
				Nessuna informazione in tempo reale disponibile
			{/if}
		{/if}
	</div>

	<main class="select-none mb-3 {loaded && api !== null ? 'visible' : 'invisible'}">
		<div bind:this={mapElement} class="h-full"/>
	</main>
</div>
