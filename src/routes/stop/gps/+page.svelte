<script lang="ts">
	export const ssr = false; //Using a browser only API, can't SSR
	import Geolocation from 'svelte-geolocation';
	import { onMount } from 'svelte';

	let coords: [longitude: number, latitude: number];
	let getPosition = false;
	let errorFlag = false;

	onMount(() => {
		getPosition = true;
	});

	function displayErr() {
		errorFlag = !errorFlag;
		return '';
	}
</script>

{#if errorFlag}
	<h1 class="font-bold text-xl">Errore</h1>
{/if}

<Geolocation
	getPosition
	bind:coords
	let:loading
	let:success
	let:error
	let:notSupported
	options={{ enableHighAccuracy: true }}
>
	{#if notSupported}
		{displayErr()}
		<div class="bg-error text-error-content text-lg">
			Il dispositivo non supporta la geolocalizzazione
		</div>
	{:else}
		{#if loading}
			Caricamento...
		{/if}
		{#if success}
			{JSON.stringify(coords)}
		{/if}
		{#if error}
			{displayErr()}
			{#if error.code === 1}
				Accesso alla posizione negato
			{:else if error.code === 2}
				Posizione non disponibile
			{:else if error.code === 3}
				Il dispositivo non ha risposto in tempo (timeout)
			{/if}
		{/if}
	{/if}
</Geolocation>

{#if errorFlag}
	<span
		>Prova a usare la
		<a href="/stop/search" class="link" data-sveltekit-preload-data> ricerca testuale</a>
	</span>
{/if}
