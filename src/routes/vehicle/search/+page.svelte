<script lang="ts">
	import { goto } from '$app/navigation';
	import Search from 'svelte-search';
	import { seo } from "$lib/stores/seo";

	$seo.title = "Ricerca veicoli";
	$seo.description = "Cerca un mezzo pubblico nella città di Torino per visualizzarne la posizione in tempo reale, la linea su cui è in servizio, un'immagine e altre curiosità. Sono disponibili informazioni riguardo a bus, autosnodati, tram e treni";

	let value = '';

	function navigate(value: string) {
		setTimeout(() => goto(`/vehicle/${value}`), 0)
	}
</script>

<div class="form-control w-full max-w-xs mx-auto lg:mx-0">
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label class="label">
		<span class="label-text">Inserisci il codice di un veicolo</span>
	</label>

	<Search
		autofocus
		hideLabel
		placeholder="Cerca"
		class="input input-bordered w-full max-w-xs"
		bind:value={value}
		on:submit={() =>navigate(value)}
		inputmode="numeric"
	/>
	<button class="btn mx-auto w-full mt-4" on:click={() =>navigate(value)}>Cerca</button>
</div>
