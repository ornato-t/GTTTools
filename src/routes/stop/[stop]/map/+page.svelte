<script lang="ts">
    import 'leaflet/dist/leaflet.css';
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import type { PageData } from "./$types";
    import type { LatLngExpression, LayerGroup, Map } from "leaflet";
    
    export let data: PageData;

    const coords = [data.db.coordinates[1], data.db.coordinates[0]] as LatLngExpression;    //Need to swap coords, mongo wants [lon, lat]; leaflet wants [lat, lon]
    
    let mapElement: HTMLElement;
    let map: Map;

    onMount(async () => {
        if(browser) {
            const leaflet = await import('leaflet');

            map = leaflet.map(mapElement).setView(coords, 30);

            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            leaflet.marker(coords).addTo(map)
                .bindPopup(`${data.db.name} si trova qui:<br>${coords}`)
                .openPopup();
        }
    });

    onDestroy(async () => {
        if(map) map.remove();
    });
</script>

<style>
    main div {
        height: 800px;
    }
</style>

<main>
    <div bind:this={mapElement}></div>
</main>