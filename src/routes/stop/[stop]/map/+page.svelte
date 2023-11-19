<script lang="ts">
    import 'leaflet/dist/leaflet.css';
    import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
    import type { PageData } from "./$types";
    import type { Marker, LatLngTuple, Map } from "leaflet";
    import type { stopDB } from "$lib/stopDB"
	import { encodeRoute, type vehicleMap } from '$lib/vehicle';
    import Loading from './loading.svelte';
	import { placeTiles } from '$lib/map';

    export let data: PageData;

    const coords = data.coords;
    
    let mapElement: HTMLElement;
    let map: Map;
    const markers = new Array<{droplet: Marker, vehicle: Marker, code: number}>;
    let loaded = false;
    let routes = new Array<vehicleMap>;
    
    const pinColour = '#1b8ae8';
    const otherPinColour = '#909090';
    const REFRESH_TIME = 1000;

    onMount(async () => {
        const L = await import('leaflet');  //Leaflet has to be imported here, it needs window to be defined
        await import('leaflet-rotatedmarker');

        const { pinIcon, otherPinIcon } = getPinIcons(L);

        map = L.map(mapElement).setView(coords, 30);
		placeTiles(L, map);

        //Place icon of queried stop
        L.marker(coords, {icon: pinIcon}).addTo(map).bindPopup(getPopup(data.db));
        
        //Place icons of nearby stops
        for(const stop of data.near){
            L.marker(stop.coordinates as LatLngTuple, {icon: otherPinIcon}).addTo(map).bindPopup(getPopup(stop));    
        }

        const passages = await data.vehicles.promise;   //Wait for vehicle data to arrive
        routes = passages;
        loaded = true;

        //Place vehicle icons
        for(const pass of passages){
            const { busIcon, tramIcon, dropletIcon } = getVehicleIcons(L, pass.colour);
            for(const vehicle of pass.vehicles){
                const vehicleIcon = vehicle.vehicleType === 'Tram' ? tramIcon : busIcon;
                const popup = `<a href="/route/${encodeRoute(pass.routeID)}"><div>Linea ${pass.route}</a><br><a href="/vehicle/${vehicle.id}">${vehicle.vehicleType} ${vehicle.id}</div></a>`;

                const dropletMark = L.marker([vehicle.lat, vehicle.lon], {icon: dropletIcon, zIndexOffset: 100, alt: vehicle.vehicleType + ' ' + vehicle.id, rotationAngle: vehicle.direction}).addTo(map).bindPopup(popup);

                const vehicleMark = L.marker([vehicle.lat, vehicle.lon], {icon: vehicleIcon, zIndexOffset: 101}).addTo(map).bindPopup(popup);
                
                markers.push({
                    droplet: dropletMark,
                    vehicle: vehicleMark,
                    code: vehicle.id
                });
            }
        }

        //Refresh vehicles positions
        setInterval(async() => {
            invalidate('stop_lines');
            const vehicles = await data.vehicles.promise;
            routes = vehicles;
            
            for(const route of vehicles){
                for(const vehicle of route.vehicles){
                    for(const marker of markers){
                        if(marker.code === vehicle.id){
                            marker.droplet.setLatLng([vehicle.lat, vehicle.lon]);
                            marker.vehicle.setLatLng([vehicle.lat, vehicle.lon]);
                            marker.droplet.setRotationAngle(vehicle.direction);                        
                        }
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
    function getPinIcons(L: any){
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

        return { pinIcon, otherPinIcon }
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

<div class="p-4 lg:grid lg:grid-cols-2" id="top">
	<h1 class="mb-4 text-xl font-semibold uppercase">{data.code} - {data.db.name}</h1>
	<h2 class="font-light order-3">{data.db.description ?? ''}</h2>
    
    <!-- Back button desktop -->
    <a class="hidden lg:inline-flex btn btn-primary rounded-lg ml-3 w-fit place-self-end" href="/stop/{data.code}"><i class='bx bx-arrow-back bx-sm mr-2'/>Torna ai passaggi</a>
</div>

<!-- Back button mobile -->
<a class="lg:hidden inline-flex btn btn-primary place-self-start rounded-lg ml-3" href="/stop/{data.code}"><i class='bx bx-arrow-back bx-sm mr-2'/>Torna ai passaggi</a>



<!-- Consider moving this on top of the map, takes too much space here -->
<div class="grid grid-cols-3 w-36 min-h-[8rem] gap-y-1 my-1">
    <div class="col-span-3 pl-2">
        Linee passanti:
    </div>

    <!-- A bit janky, assuming route's vehicle type from the first vehicle in the array -->
    {#if !loaded }
        <Loading/>
        <Loading/>
        <Loading/>
        <Loading/>
    {:else}
        {#each routes as route}
        <div class="place-self-center">
            <i class='{route.vehicles[0].vehicleType === 'Tram' ? 'bxs-train' : 'bxs-bus'}
                bx bx-xs rounded-full p-0.5 bg-base-200 border border-base-content'
                style='color: {route.colour}'
            />
        </div>
        <div class="col-span-2">
            <a href="/route/{route.routeID}" class="link">
                {route.vehicles[0].vehicleType}
                {route.route}
            </a>
        </div>
        {/each}
        <!-- Adding padding to routes list, avoids  -->
        {#if routes.length === 0}
            <div class="col-span-3"/>
            <div class="col-span-3"/>
            <div class="col-span-3"/>
            <div class="col-span-3"/>
        {:else if routes.length === 1}
            <div class="col-span-3"/>
            <div class="col-span-3"/>
            <div class="col-span-3"/>
        {:else if routes.length === 2}
            <div class="col-span-3"/>
            <div class="col-span-3"/>
        {:else if routes.length === 3}
            <div class="col-span-3"/>
        {/if}
    {/if}
</div>

<!-- TODO: needs placing, should be moved over the top right corner of the map. Putting it inside the map makes it non interactable -->
<!-- <button class="btn btn-active btn-accent btn-circle" style="z-index: 2000;">
    <a href="#top">
        <i class='bx bx-up-arrow-alt bx-md' ></i> 
    </a>
</button> -->

<main class="select-none mb-3">
    <div bind:this={mapElement} class="h-full"/>
</main>