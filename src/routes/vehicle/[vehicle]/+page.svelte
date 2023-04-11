<script lang="ts">
	import type { PageData } from './$types';
	import Counter from './counter.svelte';

	export let data: PageData;

	let dots = '...'
	setInterval(() => {
		if(dots.length !== 3) dots+='.';
		else dots = '';
	}, 500)
</script>

<div class="w-full mx-auto px-2">
	<h1 class="text-xl mb-2">
		Veicolo numero {data.code}
	</h1>

	<div class="w-fit mx-auto">
		<img src="/api/image?url={data.url}" alt="Veicolo numero {data.code}" class="max-h-96"/>
		<span class="text-sm italic">
			Foto a cura di {data.credits}
		</span>
	</div>

	{#if data.info !== undefined}
		<div class="mt-4 mb-6">
			Maggiori informazioni al seguente <a class="link" href={data.info}>link</a>.
			<!-- ERRORE: per i pullman reindirizza a un endpoint inesistente-->
		</div>
	{/if}

	<div class="mb-16 mt-3">
		{#await data.route.promise}
				<div class="mx-auto pt-44 w-fit text-center">
					<i class='bx bx-loader-circle bx-spin text-8xl'/>
					<div class="w-48 mt-4 text-xl font-light">Ricerca informazioni in tempo reale{dots}</div>
				</div>
		{:then route} 
			<h2 class="text-lg ">Informazioni in tempo reale</h2>
			{#if route === null}
				Nessuna informazione in tempo reale disponibile
			{:else}
				<ul>
					<li>In servizio sulla linea: <span class="font-mono">{route.route}</span></li>
					<li>Posizione: <span class="font-mono">{route.lat.toFixed(5)};{route.lon.toFixed(5)}</span> </li>
					<li>Aggiornato:  <span class="font-mono"> <Counter time={route.updated}/></span> <li>
				</ul>
			{/if}
		{/await}
	</div>
</div>
