<script lang="ts">
	import 'leaflet/dist/leaflet.css';
	import Counter from './counter.svelte';
    import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
    import type { Marker, LatLngTuple, Map } from "leaflet";
    import type { PageData } from "./$types";
	import type { stopDB } from '$lib/stopDB';

    export let data: PageData;

	$: numVehicles = data.api.length;

    let mapElement: HTMLElement;
    let map: Map;
    const markers = new Array<{droplet: Marker, vehicle: Marker, code: number}>;
    
    const vehicleColour = '#1cbb10';
    const REFRESH_TIME = 1000;

    onMount(async () => {
        const L = await import('leaflet');  //Leaflet has to be imported here, it needs window to be defined
        await import('leaflet-rotatedmarker');

        map = L.map(mapElement);

        //Place map tiles
        L.tileLayer('https://map.gtt.to.it/blossom/{z}/{x}/{y}.png', {
            attribution: 'GTT OpenData | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        for(const route of data.routes){
            const pinIcon = getPinIcon(L, route.pinColour);

            //Draw shape and center the map around it
            const shape = L.polyline(route.shape as LatLngTuple[], {color: route.shapeColour}).addTo(map);
            map.fitBounds(shape.getBounds());

            //Wait for stops data, then place icons of nearby stops
            route.stops.promise.then(stops => {
                for(const stop of stops){
                    L.marker(stop.coordinates as LatLngTuple, {icon: pinIcon}).addTo(map).bindPopup(getPopup(stop));    
                }
            });
        }

        //Place vehicle icons
        const { busIcon, tramIcon, dropletIcon } = getVehicleIcons(L, vehicleColour);
        for(const vehicle of data.api){
            const vehicleIcon = vehicle.vehicleType === 'Tram' ? tramIcon : busIcon;
            const popup = `<a href="/vehicle/${vehicle.id}"><div>${vehicle.vehicleType} ${vehicle.id}</div></a>`;

            const dropletMark = L.marker([vehicle.lat, vehicle.lon], {icon: dropletIcon, zIndexOffset: 100, alt: vehicle.vehicleType + ' ' + vehicle.id, rotationAngle: vehicle.direction}).addTo(map).bindPopup(popup);

            const vehicleMark = L.marker([vehicle.lat, vehicle.lon], {icon: vehicleIcon, zIndexOffset: 101}).addTo(map).bindPopup(popup);
            
            markers.push({
                droplet: dropletMark,
                vehicle: vehicleMark,
                code: vehicle.id
            });
        }

        //Refresh vehicles positions
        setInterval(async() => {
            invalidate('vehicle');
            for(const vehicle of data.api){
                for(const marker of markers){
                    if(marker.code === vehicle.id){
                        marker.droplet.setLatLng([vehicle.lat, vehicle.lon]);
                        marker.vehicle.setLatLng([vehicle.lat, vehicle.lon]);
                        marker.droplet.setRotationAngle(vehicle.direction);
                    }
                }
            }
        }, REFRESH_TIME);

    });

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
        const otherPinIcon = L.divIcon({
            html: `<i class='bx bxs-map text-3xl' style='color: ${colour}; transform: translateY(-50%);'></i>`,
            iconSize: [20, 20],
            className: ''
        });

        return otherPinIcon;
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

<svelte:head>
	<title>Linea {data.db.type.toLowerCase()} {data.code}: informazioni in tempo reale</title>
	<meta name="description" content="Posizioni aggiornate in tempo reale e numero di veicoli in servizio sui {data.db.type.toLowerCase()} della linea {data.code}">
</svelte:head>

<style>
    main div {
        height: 80vh;
    }
</style>

<div class="p-4">
	<h1 class="mb-4 text-xl font-semibold uppercase">{data.code} - {data.db.type}</h1>
	<h2 class="font-light">{data.db.name}</h2>
</div>

<div class="px-4 py-2">
	<h4 class="font-normal">Numero di veicoli in servizio: {numVehicles}</h4>
</div>

<!-- Desktop -->
<div class="hidden lg:grid grid-cols-2 xl:grid-cols-3 min-[1900px]:grid-cols-4 gap-4 mt-2">
	{#if numVehicles !== 0}
		{#key data.api}
			{#each data.api as vehicle}
				<a href="/vehicle/{vehicle.id}" data-sveltekit-preload-data>
					<div
						class="card w-96 h-full bg-neutral hover:bg-neutral-focus text-neutral-content shadow-xl"
					>
						<div class="card-body p-6">
							<h2 class="card-title mb-4 grid grid-cols-4">
								<span class="text-2xl text-left">{vehicle.id}</span>
								<span class="text-sm font-light text-right col-span-3">
									{vehicle.vehicleType?.toUpperCase()}
								</span>
							</h2>

							<div class="mx-auto -mb-2">Posizione:</div>
							<div class="mx-auto font-mono">
								{vehicle.lat},{vehicle.lon}
							</div>

							<div class="justify-end mt-4">
								<!-- {#if vehicle.full}
									<div class="text-warning mx-auto w-fit my-2">Veicolo pieno!</div>
								{/if} -->
								<div class="font-mono text-sm text-end">
									Aggiornato <Counter time={vehicle.updated}/>
								</div>
							</div>
						</div>
					</div>
				</a>
			{/each}
		{/key}
	{:else}
		<div class="font-light px-4">Nessuna informazione in tempo reale disponibile.</div>
	{/if}
</div>

<!-- Mobile -->
<div class="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 mb-6 mx-auto place-items-center">
	{#if numVehicles !== 0}
		{#key data.api}
			{#each data.api as vehicle}
				<div class="card card-compact w-[22rem] h-full bg-neutral hover:bg-neutral-focus text-neutral-content shadow-xl">
					<a href="/vehicle/{vehicle.id}" data-sveltekit-preload-data="hover">
						<div class="card-body p-6">
							<h2 class="card-title  mb-4 grid grid-cols-4">
								<span class="text-2xl text-left">{vehicle.id}</span>
								<span class="text-sm font-light text-right col-span-3">
									{vehicle.vehicleType?.toUpperCase()}
								</span>
							</h2>
							<div class="mx-auto -mb-2">Posizione:</div>
							<div class="mx-auto font-mono">
								{vehicle.lat},{vehicle.lon}
							</div>

							<div class="justify-end mt-4">
								<!-- {#if vehicle.full}
									<div class="text-warning mx-auto w-fit my-2">Veicolo pieno!</div>
								{/if} -->
								<div class="font-mono text-sm text-end">
									Aggiornato <Counter time={vehicle.updated}/>
								</div>
							</div>
						</div>
					</a>
				</div>
			{/each}
		{/key}
	{:else}
		<div class="font-light px-4">Nessuna informazione in tempo reale disponibile.</div>
	{/if}
</div>

<main class="select-none mb-3 mt-6">
    <div bind:this={mapElement} class="h-full"/>
</main>
