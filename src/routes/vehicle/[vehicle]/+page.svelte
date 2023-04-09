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
	</div>
{/if}

<div class="mb-16">
	{#await data.route.promise}
			<div class="mx-auto pt-44 w-fit text-center">
				<i class='bx bx-loader-circle bx-spin text-8xl'/>
				<div class="w-40 mt-4 text-xl font-light">Ricerca linea{dots}</div>
			</div>
	{:then route} 
		<!-- {route} -->
	{/await}
</div>
