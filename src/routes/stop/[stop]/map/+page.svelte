<script lang="ts">
    import 'leaflet/dist/leaflet.css';
    import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
    import type { PageData } from "./$types";
    import type { Marker, LatLngTuple, Map } from "leaflet";
    import type { stopDB } from "$lib/stopDB"

    export let data: PageData;

    const coords = data.coords;
    
    let mapElement: HTMLElement;
    let map: Map;
    const markers = new Array<{marker: Marker, code: number}>;
    
    const pinColour = '#1b8ae8';
    const otherPinColour = '#909090';
    const REFRESH_TIME = 1000;

    onMount(async () => {
        const L = await import('leaflet');  //Leaflet has to be imported here, it needs window to be defined

        const { pinIcon, otherPinIcon } = getPinIcons(L);

        map = L.map(mapElement).setView(coords, 30);

        //Place map tiles
        L.tileLayer('https://map.gtt.to.it/blossom/{z}/{x}/{y}.png', {
            attribution: 'GTT OpenData | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        //Place icon of queried stop
        L.marker(coords, {icon: pinIcon}).addTo(map).bindPopup(`<a href="/stop/${data.db.code}">${data.db.code} - ${data.db.name}</a>`);
        
        //Place icons of nearby stops
        for(const stop of data.near){
            L.marker(stop.coordinates as LatLngTuple, {icon: otherPinIcon}).addTo(map).bindPopup(getPopup(stop));    
        }

        const passages = await data.vehicles.promise;   //Wait for vehicle data to arrive

        //Place vehicle icons
        for(const pass of passages){
            for(const vehicle of pass.vehicles){
                const { busIcon, tramIcon } = getVehicleIcons(L, pass.colour);

                if(vehicle.vehicleType === 'Tram'){
                    markers.push({
                        marker: L.marker([vehicle.lat, vehicle.lon], {icon: tramIcon, zIndexOffset: 10, alt: vehicle.vehicleType + ' ' + pass.route}).addTo(map).bindPopup(`<a href="/route/${pass.routeID}"><div>Linea ${pass.route}<br>${vehicle.vehicleType} ${vehicle.id}</div></a>`),
                        code: vehicle.id
                    });
                } else {
                    markers.push({
                        marker: L.marker([vehicle.lat, vehicle.lon], {icon: busIcon, zIndexOffset: 10, alt: vehicle.vehicleType + ' ' + pass.route}).addTo(map).bindPopup(`<a href="/route/${pass.routeID}"><div>Linea ${pass.route}<br>${vehicle.vehicleType} ${vehicle.id}</div></a>`),
                        code: vehicle.id
                    });
                }
            }
        }

        //Refresh vehicles positions
        setInterval(async() => {
            invalidate('stop_lines');
            const vehicles = await data.vehicles.promise;
            
            for(const route of vehicles){
                for(const vehicle of route.vehicles){
                    for(const marker of markers){
                        if(marker.code === vehicle.id){
                            marker.marker.setLatLng([vehicle.lat, vehicle.lon]);
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
        height: 800px;
    }
</style>

<main class="select-none mb-3">
    <div bind:this={mapElement}/>
</main>