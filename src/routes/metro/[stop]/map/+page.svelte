<script lang="ts">
    import type { PageData } from "./$types";
	import Map from '$lib/map/map.svelte';

    export let data: PageData; 
</script>

<div class="p-4 lg:grid lg:grid-cols-2" id="top">
	<h1 class="mb-4 text-xl font-semibold uppercase">{data.db.name}</h1>
	<h2 class="font-light order-3">{data.db.description}</h2>
    
    <!-- Back button desktop -->
    <a class="hidden lg:inline-flex btn btn-primary rounded-lg ml-3 w-fit place-self-end" href="/metro/{data.code}"><i class='bx bx-arrow-back bx-sm mr-2'/>Torna ai passaggi</a>
</div>

<!-- Back button mobile -->
<a class="lg:hidden inline-flex btn btn-primary place-self-start rounded-lg ml-3 mt-2 mb-4" href="/metro/{data.code}"><i class='bx bx-arrow-back bx-sm mr-2'/>Torna ai passaggi</a>

<!-- TODO: needs placing, should be moved over the top right corner of the map. Putting it inside the map makes it non interactable -->
<!-- <button class="btn btn-active btn-accent btn-circle" style="z-index: 2000;">
    <a href="#top">
        <i class='bx bx-up-arrow-alt bx-md' ></i> 
    </a>
</button> -->

<Map coords={data.coords} db={data.db} near={data.near} />
