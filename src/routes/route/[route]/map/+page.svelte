<script lang="ts">
    import 'leaflet/dist/leaflet.css';
    import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
    import type { Marker, LatLngTuple, Map, LatLngExpression } from "leaflet";
    import type { PageData } from "./$types";
	import type { stopDB } from '$lib/stopDB';
	import type { vehicle } from '$lib/vehicle';

    export let data: PageData;
    
    let mapElement: HTMLElement;
    let map: Map;
    const markers = new Array<{marker: Marker, code: number}>;
    
    const otherPinColour = '#909090';
    const vehicleColour = '#1b8ae8';
    const REFRESH_TIME = 1000;

    //TODO: pick colours for indicators, vehicles, line. Remove junk text down below
    onMount(async () => {
        const L = await import('leaflet');  //Leaflet has to be imported here, it needs window to be defined
        const otherPinIcon = getPinIcon(L);
        map = L.map(mapElement);   //Center on Piazza Castello - symbolic value, really

        //Place map tiles
        L.tileLayer('https://map.gtt.to.it/blossom/{z}/{x}/{y}.png', {
            attribution: 'GTT OpenData | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        //Draw shape and center the map around it
        const shape = L.polyline(data.shape, {color: 'red'}).addTo(map);
        map.fitBounds(shape.getBounds());

        //Wait for stops data, then place icons of nearby stops
        data.stops.promise.then(stops => {
            for(const stop of stops){
                L.marker(stop.coordinates as LatLngTuple, {icon: otherPinIcon}).addTo(map).bindPopup(getPopup(stop));    
            }
        });

        //Place vehicle icons
        const { busIcon, tramIcon } = getVehicleIcons(L, vehicleColour);
        for(const vehicle of data.api){
            const icon = vehicle.vehicleType === 'Tram' ? tramIcon : busIcon;
            
            markers.push({
                marker: L.marker([vehicle.lat, vehicle.lon], {icon: icon, zIndexOffset: 10, alt: vehicle.vehicleType + ' ' + vehicle.id}).addTo(map).bindPopup(`<a href="/vehicle/${vehicle.id}"><div>${vehicle.id}</div></a>`),
                code: vehicle.id
            });
           
        }

        //Refresh vehicles positions
        setInterval(async() => {
            invalidate('vehicle');

            for(const vehicle of data.api){
                for(const marker of markers){
                    if(marker.code === vehicle.id){
                        marker.marker.setLatLng([vehicle.lat, vehicle.lon]);
                    }
                }
            }
        }, REFRESH_TIME);

    });

    function getAveragePos(vehicles: vehicle[]): LatLngTuple{
        let totLat = 0, totLon = 0, size = vehicles.length;

        for(const v of vehicles){
            totLat += v.lat;
            totLon += v.lon;
        }

        return [totLat/size, totLon/size]
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
    function getPinIcon(L: any){
        const otherPinIcon = L.divIcon({
            html: `<i class='bx bxs-map text-3xl' style='color: ${otherPinColour}'></i>`,
            iconSize: [20, 20],
            className: ''
        });

        return otherPinIcon;
    }

    //Return a set of coloured, leaflet marker icons
    function getVehicleIcons(L: any, colour: string){
        const busIcon = L.divIcon({
            html: `<i class='bx bxs-bus bx-sm rounded-full p-1 bg-white border border-black' style='color: ${colour}'></i>`,
            iconSize: [20, 20],
            className: ''
        });

        const tramIcon = L.divIcon({
            html: `<i class='bx bxs-train bx-sm rounded-full p-1 bg-white border border-black' style='color: ${colour}'></i>`,
            iconSize: [20, 20],
            className: ''
        });

        return {busIcon, tramIcon}
    }
</script>

<style>
    main div {
        height: 80vh;
    }
</style>

<main class="select-none mb-3">
    <div bind:this={mapElement} class="h-full"/>
</main>

<div class="mb-6">
    <div class="text-lg font-bold">Codice:</div>
    <div>{data.code}</div>
    <div class="text-lg font-bold">Dati da database:</div>
    <div>{JSON.stringify(data.db)}</div>
    <div class="text-lg font-bold">Dati in tempo reale:</div>
    {#each data.api as vehicle}
        <div>{JSON.stringify(vehicle)}</div>
    {/each}
    <div class="text-lg font-bold">Percorso (punti)</div>
    <div>
        {#each data.shape as point}
            <div>{point}</div>
        {/each}
    </div>
    {#await data.stops.promise then stops}
        <div class="text-lg font-bold">Fermate:</div>
        {#each stops as stop}
            <div>{JSON.stringify(stop)}</div>
        {/each}
    {/await}
</div>
