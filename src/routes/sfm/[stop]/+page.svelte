<script lang="ts">
	import { invalidate, preloadData } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Loading from './loading.svelte';
	import Timer from './timer.svelte';
	import type { trainStation } from '$lib/train';

	export let data: PageData;

	let api: trainStation;
	
	//Refresh data every 5 seconds
	onMount(async () => {
		api = await data.api.promise	//First refresh the data
		preloadData(`/sfm/${data.code}/map`);

		setInterval(async () => {
			await invalidate('sfm');		//Wait for page reload
			api = await data.api.promise	//Then refresh the data
		}, 5000);
	});

	function printLocale(d: Date) {
		const formatter = Intl.DateTimeFormat('it-it', {
			minute: '2-digit',
			hour: '2-digit',
			hour12: false,
			timeZone: 'CET'
		});

		return formatter.format(new Date(d));
	}
</script>

<svelte:head>
	<title>Stazione ferroviaria di TORINO {data.db.name}</title>
	<meta name="description" content="Prossimi passaggi in tempo reale di treni Regionali, Regionali Veloci e del Servizio Ferroviario Metropolitano, alla stazione ferroviaria di TORINO {data.db.name}">
</svelte:head>

<div class="p-4 lg:grid lg:grid-cols-2">
	<h1 class="mb-4 text-xl font-semibold uppercase">{data.db.name}</h1>
	<h2 class="font-light order-3">{data.db.description }</h2>
    
    <!-- Map button desktop -->
    <a class="hidden lg:inline-flex btn btn-primary rounded-lg ml-3 w-fit place-self-end" href="/sfm/{data.code}/map"><i class='bx bx-map-alt bx-sm mr-2'/>Visualizza sulla mappa</a>
</div>

<!-- Desktop -->
<div class="hidden lg:grid grid-cols-2 xl:grid-cols-3 min-[1900px]:grid-cols-4 gap-4 mt-2">
	{#if api == null}
		<Loading />
		<Loading />
		<Loading />
	{:else} 
		{#key api}
			{#each api.departures as route}
				<div class="card w-96 h-full bg-neutral hover:bg-neutral-focus text-neutral-content shadow-xl">
					<div class="card-body p-6">
						{#if route.trips.length > 0}
							<h2 class="card-title mb-2 text-2xl">
								{route.name}
							</h2>
							<div class="justify-end">
								<div class="w-full grid grid-cols-4">
									<div class="text-sm pb-2 text-left">Orario</div>
									<div class="text-sm pb-2 text-left">Treno</div>
									<div class="text-sm pb-2 text-left">Binario</div>
									<div class="text-sm pb-2 text-end">Rimanente</div>
									{#each route.trips as time}
										<div class="text-left">
											{printLocale(time.departure)}
										</div>
										<div>
											{time.name}
										</div>
										<div class="pl-3.5">
											{#if time.platform != null}
												{#if time.platform.id != null}
													<span class={time.platform.confirmed ? '' : 'opacity-50'}>{time.platform.id}</span>
												{:else}
													<span class="opacity-50">?</span>
												{/if}
											{:else}
												<span class="opacity-50">?</span>
											{/if}
										</div>
										<div class="justify-end countdown font-mono">
											<Timer time={time.departure} />
										</div>
									{/each}
								</div>
							</div>
						{:else}
							<p>Nessuna informazione disponibile</p>
						{/if}
					</div>
				</div>
			{/each}
		{/key}
	{/if}
</div>

<!-- Mobile -->
<div class="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 mb-6 mx-auto place-items-center">
	<!-- Map button mobile -->
	<a class="btn btn-primary place-self-start ml-3 rounded-lg col-span-1 md:col-span-2" href="/sfm/{data.code}/map"><i class='bx bx-map-alt bx-sm mr-2'/> Visualizza sulla mappa</a>

	{#if api == null}
	<!-- {#if 1 == 1} -->
	<div class="mx-4 grid gap-y-4">
		<Loading />
		<Loading />
		<Loading />
	</div>
	{:else} 
		{#key api}
			{#each api.departures as route}
				<div class="card card-compact w-[22rem] h-full bg-neutral hover:bg-neutral-focus text-neutral-content shadow-xl">
					<div class="card-body p-6">
						{#if route.trips.length > 0}
							<h2 class="card-title text-2xl">
								{route.name}
							</h2>
							<div class="justify-end">
								<div class="w-full grid grid-cols-4">
									<div class="text-xs pb-1 text-left">Orario</div>
									<div class="text-xs pb-1 text-left">Treno</div>
									<div class="text-xs pb-1 text-left">Binario</div>
									<div class="text-xs pb-1 text-end">Rimanente</div>

									{#each route.trips as time}
										<div class="text-left">
											{printLocale(time.departure)}
										</div>
										<div>
											{time.name}
										</div>
										<div class="pl-3.5">
											{#if time.platform != null}
												{#if time.platform.id != null}
													<span class={time.platform.confirmed ? '' : 'opacity-50'}>{time.platform.id}</span>
												{:else}
													<span class="opacity-50">?</span>
												{/if}
											{:else}
												<span class="opacity-50">?</span>
											{/if}
										</div>
										<div class="justify-end countdown font-mono">
											<Timer time={time.departure} />
										</div>
									{/each}
								</div>
							</div>
						{:else}
							<p>Nessuna informazione disponibile</p>
						{/if}
					</div>
				</div>
			{/each}
		{/key}
	{/if}
</div>

