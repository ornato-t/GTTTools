<script lang="ts">
    import 'leaflet/dist/leaflet.css';
    import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
    import type { PageData } from "./$types";
    // import type { Marker, LatLngTuple, Map } from "leaflet";

    export let data: PageData;
    
    onMount(() => setInterval(() => invalidate('vehicle'), 1000));
</script>

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
