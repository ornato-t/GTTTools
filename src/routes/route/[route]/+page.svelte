<script lang="ts">
	import type { PageData } from './$types';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Counter from './counter.svelte';

	//Refresh data every seconds
	onMount(() => setInterval(() => invalidate('vehicle'), 1000));

	$: numVehicles = data.api.length;

	export let data: PageData;
</script>

<svelte:head>
	<title>Linea {data.db.type.toLowerCase()} {data.code}: informazioni in tempo reale</title>
	<meta name="description" content="Posizioni aggiornate in tempo reale e numero di veicoli in servizio sui {data.db.type.toLowerCase()} della linea {data.code}">
</svelte:head>

<div class="p-4">
	<h1 class="mb-4 text-xl font-semibold uppercase">{data.code} - {data.db.type}</h1>
	<h2 class="font-light">{data.db.name}</h2>
</div>

<div class="px-4 py-2">
	<h4 class="font-normal">Numero di veicoli in servizio: {numVehicles}</h4>
</div>

<!-- Desktop -->
<div class="hidden lg:grid grid-cols-2 xl:grid-cols-3 min-[1900px]:grid-cols-4 gap-4 mt-2">
	{#if numVehicles !== 0}
		{#key data.api}
			{#each data.api as vehicle}
				<a href="/vehicle/{vehicle.id}">
					<div
						class="card w-96 h-full bg-neutral hover:bg-neutral-focus text-neutral-content shadow-xl"
					>
						<div class="card-body p-6">
							<h2 class="card-title mb-4 grid grid-cols-4">
								<span class="text-2xl text-left">{vehicle.id}</span>
								<span class="text-sm font-light text-right col-span-3">
									{vehicle.vehicleType?.toUpperCase()}
								</span>
							</h2>

							<div class="mx-auto -mb-2">Posizione:</div>
							<div class="mx-auto font-mono">
								{vehicle.lat},{vehicle.lon}
							</div>

							<div class="justify-end mt-4">
								<!-- {#if vehicle.full}
									<div class="text-warning mx-auto w-fit my-2">Veicolo pieno!</div>
								{/if} -->
								<div class="font-mono text-sm text-end">
									Aggiornato <Counter time={vehicle.updated}/>
								</div>
							</div>
						</div>
					</div>
				</a>
			{/each}
		{/key}
	{:else}
		<div class="font-light px-4">Nessuna informazione in tempo reale disponibile.</div>
	{/if}
</div>

<!-- Mobile -->
<div class="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 mb-6 mx-auto place-items-center">
	{#if numVehicles !== 0}
		{#key data.api}
			{#each data.api as vehicle}
				<div
					class="card card-compact w-[22rem] h-full bg-neutral hover:bg-neutral-focus text-neutral-content shadow-xl"
				>
					<a href="/vehicle/{vehicle.id}">
						<div class="card-body p-6">
							<h2 class="card-title  mb-4 grid grid-cols-4">
								<span class="text-2xl text-left">{vehicle.id}</span>
								<span class="text-sm font-light text-right col-span-3">
									{vehicle.vehicleType?.toUpperCase()}
								</span>
							</h2>
							<div class="mx-auto -mb-2">Posizione:</div>
							<div class="mx-auto font-mono">
								{vehicle.lat},{vehicle.lon}
							</div>

							<div class="justify-end mt-4">
								<!-- {#if vehicle.full}
									<div class="text-warning mx-auto w-fit my-2">Veicolo pieno!</div>
								{/if} -->
								<div class="font-mono text-sm text-end">
									Aggiornato <Counter time={vehicle.updated}/>
								</div>
							</div>
						</div>
					</a>
				</div>
			{/each}
		{/key}
	{:else}
		<div class="font-light px-4">Nessuna informazione in tempo reale disponibile.</div>
	{/if}
</div>
