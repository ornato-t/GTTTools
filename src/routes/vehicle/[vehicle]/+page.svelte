<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	let dots = '...'
	setInterval(() => {
		if(dots.length !== 3) dots+='.';
		else dots = '';
	}, 500)
</script>


<div>
	Veicolo numero {data.code}
</div>

<div class="w-fit mx-auto">
	<img src="/api/image?url={data.url}" alt="Veicolo numero {data.code}" class="max-h-96"/>
	<span class="text-sm italic">
		Foto a cura di {data.credits}
	</span>
</div>

{#if data.info !== undefined}
	<div>
		Maggiori informazioni al seguente <a class="link" href={data.info}>link</a>.
		<!-- ERRORE: per i pullman reindirizza a un endpoint inesistente-->
	</div>
{/if}

<div class="mb-16">
	{#await data.route.promise}
			<div class="mx-auto pt-44 w-fit text-center">
				<i class='bx bx-loader-circle bx-spin text-8xl'/>
				<div class="w-40 mt-4 text-xl font-light">Ricerca linea{dots}</div>
			</div>
	{:then route} 
	{#if route === null}
			Nessuna informazione in tempo reale disponibile
	{:else}
	<br>
		<ul>
			<li>Linea {route.route}</li>
			<li>Lat {route.lat}</li>
			<li>Lon {route.lon}</li>
			<li>Aggiornato il {route.updated}</li>
		</ul>
	{/if}
	{/await}
</div>
