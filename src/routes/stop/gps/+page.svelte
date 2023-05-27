<script lang="ts">
	import Geolocation from 'svelte-geolocation';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let coords: GeolocationCoordinates;
	let getPosition = false;
	let errorFlag = false;
	let errorCode: number;

	let dots = '...'
	setInterval(() => {
		if(dots.length !== 3) dots+='.';
		else dots = '';
	}, 500)

	onMount(() => {
		getPosition = true;
	});
</script>

<Geolocation
	getPosition
	on:position={(e) => {
		coords = e.detail.coords;
		const url = `/stop/gps/${coords.longitude};${coords.latitude};${Math.round(coords.accuracy)}`;
		goto(url); //Redirect to DB query page
	}}
	on:error={(e) => {
		//TODO: check for unsupported device error
		errorFlag = true;
		// @ts-ignore
		errorCode = e.detail.code; //This isn't an error
	}}
	options={{ enableHighAccuracy: true }}
/>

{#if !errorFlag}
	<div class="mx-auto pt-44 w-fit text-center">
		<i class='bx bxs-map bx-spin text-9xl'/>
		<div class="w-40 mt-4 text-xl font-light">Caricamento{dots}</div>
	</div>
{:else}
	<h1 class="font-bold text-xl">Errore</h1>
		<div class="bg-error text-error-content text-lg">
			{#if errorCode === 1}
				Accesso alla posizione negato
			{:else if errorCode === 2}
				Posizione non disponibile
			{:else if errorCode === 3}
				Il dispositivo non ha risposto in tempo (timeout)
			{/if}
		</div>
		<span>
			Prova a usare la
			<a href="/stop/search" class="link" data-sveltekit-preload-data> ricerca testuale</a>
		</span>
{/if}
