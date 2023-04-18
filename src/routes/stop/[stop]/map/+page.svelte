<script lang="ts">
    import 'leaflet/dist/leaflet.css';
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import type { PageData } from "./$types";
    import type { Map } from "leaflet";
    
    export let data: PageData;

    const coords = data.coords;

    //TODO: add invalidation for vehicle positions (and therefore stop passages). It will take a while
    
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
                .bindPopup(`<a href="/stop/${data.db.code}">${data.db.code} - ${data.db.name}</a>`)
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