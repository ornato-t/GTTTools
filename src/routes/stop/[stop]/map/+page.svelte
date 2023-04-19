<script lang="ts">
    import 'leaflet/dist/leaflet.css';
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import type { PageData } from "./$types";
    import type { LatLngTuple, Map } from "leaflet";
    import type { stopDB } from "$lib/stopDB"

    export let data: PageData;

    const coords = data.coords;

    //TODO: add invalidation for vehicle positions (and therefore stop passages). It will take a while
    
    let mapElement: HTMLElement;
    let map: Map;
    
    const pinColour = '#1b8ae8';
    const otherPinColour = '#909090';

    onMount(async () => { if(browser) {
        const L = await import('leaflet');

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


        map = L.map(mapElement).setView(coords, 30);

        L.tileLayer('https://map.gtt.to.it/blossom/{z}/{x}/{y}.png', {
            attribution: 'GTT OpenData | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker(coords, {icon: pinIcon}).addTo(map)
            .bindPopup(`<a href="/stop/${data.db.code}">${data.db.code} - ${data.db.name}</a>`);
            
        for(const stop of data.near){
            L.marker(stop.coordinates as LatLngTuple, {icon: otherPinIcon}).addTo(map).bindPopup(getPopup(stop));    
        }

        const passages = await data.vehicles.promise;
        for(const pass of passages){
            const busIcon = L.divIcon({
                html: `<i class='bx bxs-bus bx-sm rounded-full p-1 bg-white border border-black' style='color: ${pass.colour}'></i>`,
                iconSize: [20, 20],
                className: ''
            });

            const tramIcon = L.divIcon({
                html: `<i class='bx bxs-train bx-sm rounded-full p-1 bg-white border border-black' style='color: ${pass.colour}'></i>`,
                iconSize: [20, 20],
                className: ''
            });
            
            for(const vehicle of pass.vehicles){
                if(vehicle.vehicleType === 'Tram'){
                    L.marker([vehicle.lat, vehicle.lon], {icon: tramIcon}).addTo(map)
                        .bindPopup(`<a href="/route/${pass.routeID}"><div>Linea ${pass.route}<br>${vehicle.vehicleType} ${vehicle.id}</div></a>`);
                } else {
                    L.marker([vehicle.lat, vehicle.lon], {icon: busIcon}).addTo(map)
                        .bindPopup(`<a href="/route/${pass.routeID}"><div>Linea ${pass.route}<br>${vehicle.vehicleType} ${vehicle.id}</div></a>`);
                }
            }
        }
    }});

    onDestroy(async () => {
        if(map) map.remove();
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
</script>

<style>
    main div {
        height: 800px;
    }
</style>

<main class="select-none">
    <div bind:this={mapElement}></div>
</main>