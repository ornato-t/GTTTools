<script lang="ts">
    import 'leaflet/dist/leaflet.css';
    import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
    import type { PageData } from "./$types";
    import type { Marker, LatLngTuple, Map } from "leaflet";
    import type { stopDB } from "$lib/stopDB"

    export let data: PageData;
</script>

<div>
    {JSON.stringify(data)}
    <br>
    {#await data.stops.promise then stops}
        {JSON.stringify(stops)}
    {/await}
</div>