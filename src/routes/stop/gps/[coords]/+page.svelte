<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div>Precisione: <span class="italic">{data.accuracy}m</span></div>
<div class="grid lg:grid-cols-2 gap-y-1 lg:gap-4">
	{#each data.stops as stop}
		<a class="my-1 card card-compact bg-base-200 btn h-fit" href="/stop/{stop.code}">
			<div class="card-body w-full grid grid-cols-4">
				<span class=" text-primary col-span-3 card-title">{stop.name}</span>
				<span class="text-secondary py-1"> {stop.code}</span>
				{#if stop.description != undefined && stop.description != stop.name}
					<span class="col-span-4 text-xs italic place-self-start">{stop.description}</span>
				{/if}
			</div>
		</a>
	{/each}
</div>
