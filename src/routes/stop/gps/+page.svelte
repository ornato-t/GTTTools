<script lang="ts">
	export const ssr = false; //Using a browser only API, can't SSR
	import Geolocation from 'svelte-geolocation';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let coords: GeolocationCoordinates;
	let getPosition = false;
	let errorFlag = false;
	let errorCode: number;

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
		errorCode = e.detail.code; //This isn't an error
	}}
	options={{ enableHighAccuracy: true }}
/>

{#if errorFlag}
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
	<span
		>Prova a usare la
		<a href="/stop/search" class="link" data-sveltekit-preload-data> ricerca testuale</a>
	</span>
{:else}
	Caricamento...
{/if}
