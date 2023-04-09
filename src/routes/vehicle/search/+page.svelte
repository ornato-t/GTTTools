<script lang="ts">
	import { goto } from '$app/navigation';

	let value = '';
</script>

<div class="form-control w-full max-w-xs mx-auto lg:mx-0">
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label class="label">
		<span class="label-text">Inserisci il codice di un veicolo</span>
	</label>

	<form on:submit={() => setTimeout(() => goto(`/vehicle/${value}`), 0)}>
		<!-- svelte-ignore a11y-autofocus -->
		<input type="text" bind:value class="input input-bordered w-full max-w-xs" placeholder="Cerca" autofocus>
		
		<button class="btn mx-auto w-full mt-4" type="submit">Cerca</button>
	</form>
</div>
