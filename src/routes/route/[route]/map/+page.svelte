<script lang="ts">
    import 'leaflet/dist/leaflet.css';
    import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
    import type { Marker, LatLngTuple, Map } from "leaflet";
    import type { PageData } from "./$types";
	import type { stopDB } from '$lib/stopDB';

    export let data: PageData;

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

<style>
    main div {
        height: 80vh;
    }
</style>

<main class="select-none mb-3">
    <div bind:this={mapElement} class="h-full"/>
</main>

