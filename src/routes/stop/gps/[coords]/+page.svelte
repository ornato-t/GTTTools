<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div>Precisione: <span class="italic">{data.accuracy}m</span></div>
<div class="lg:grid lg:grid-cols-2 lg:gap-4">
	{#each data.stops as stop}
		<a class="my-1 card bg-base-200 btn h-fit" href="/stop/{stop.code}">
			<div class="card-body grid grid-cols-2 lg:grid-cols-3">
				<span class=" text-primary lg:col-span-2 card-title">{stop.name}</span>
				<span class="text-secondary"> {stop.code}</span>
				{#if stop.description != undefined && stop.description != stop.name}
					<span class="col-span-2 lg:col-span-3 text-xs italic place-self-start">{stop.description}</span>
				{/if}
			</div>
		</a>
	{/each}
</div>
