<script lang="ts">
	import { goto } from '$app/navigation';

	let value = '';
</script>

<svelte:head>
	<title>Ricerca veicoli</title>
	<meta name="description" content="Pagina di ricerca dei mezzi pubblici di Torino. Possibilità di visualizzarne la posizione in tempo reale, la linea su cui sono in servizio, un'immagine e altre curiosità. Sono disponibili informazioni riguardo a bus, autosnodati, tram e treni">
</svelte:head>

<div class="form-control w-full max-w-xs mx-auto lg:mx-0">
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label class="label">
		<span class="label-text">Inserisci il codice di un veicolo</span>
	</label>

	<!-- For some reason not using the timeout here breaks everyting -->
	<form on:submit={() => setTimeout(() => goto(`/vehicle/${value}`), 0)}>
		<!-- svelte-ignore a11y-autofocus -->
		<input type="text" bind:value class="input input-bordered w-full max-w-xs" placeholder="Cerca" autofocus inputmode="numeric">
		
		<button class="btn mx-auto w-full mt-4" type="submit">Cerca</button>
	</form>
</div>
