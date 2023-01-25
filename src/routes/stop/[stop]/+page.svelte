<script lang="ts">
	import type { PageData } from './$types';
	import getStop from './getStop';
	import Timer from './timer.svelte';

	function printLocale(d: Date) {
		const formatter = Intl.DateTimeFormat('it-it', {
			minute: '2-digit',
			hour: '2-digit',
			hour12: false,
			timeZone: 'CET'
		});

		return formatter.format(new Date(d));
	}

	export let data: PageData;
	let api = getStop(data.code);
</script>

<h1 class="mb-4 font-bold">Fermata numero {data.code}</h1>
<div class="my-4">
	<p>Nome: {data.db.name}</p>
	<p>Descrizione: {data.db.description}</p>
	<!-- <p>Lat: {data.db.coordinates.lat}</p>
	<p>Lon: {data.db.coordinates.lon}</p> -->
</div>

<!-- Desktop -->
<div class="hidden lg:grid grid-cols-4 gap-4 mt-2">
	{#await api then stop}
		{#each stop as pass}
			<a href="/route/{pass.route}" data-sveltekit-preload-data>
				<div class="card w-96 h-full bg-neutral hover:bg-neutral-focus shadow-xl">
					<div class="card-body p-6">
						{#if pass.pass.length > 0}
							<h2 class="card-title  mb-4 grid grid-cols-4">
								<span class="text-2xl text-left">{pass.route}</span>
								<span class="text-sm font-light text-right col-span-3">
									{pass.direction}
								</span>
							</h2>
							<div class="justify-end">
								<div class="w-full grid grid-cols-3">
									{#each pass.pass as time}
										<div class="text-left">
											{printLocale(time)}
										</div>
										<div class="justify-end col-span-2 countdown font-mono">
											<Timer {time}/>
										</div>
									{/each}
								</div>

								{#if !pass.realTime}
									<div class="divider mb-0 mt-4" />
									<div class="italic text-sm w-fit mx-auto opacity-60">
										Informazioni in tempo reale non disponibili
									</div>
								{/if}
							</div>
						{:else}
							<p>Nessuna informazione disponibile</p>
						{/if}
					</div>
				</div>
			</a>
		{/each}
	{/await}
</div>

<!-- Mobile -->
<div class="lg:hidden">
	{#await api then stop}
		{#each stop as pass}
			<div class="my-1">
				{#if pass.pass.length > 0}
					<a href="/route/{pass.route}" class="link" data-sveltekit-preload-data>
						<p>Linea {pass.route}</p>
					</a>
					{#if !pass.realTime}
						<span class="=">Informazioni in tempo reale non disponibili</span>{/if}
					{#each pass.pass as time}
						<p>{printLocale(time)}</p>
					{/each}
				{:else}
					<p>Nessuna informazione disponibile</p>
				{/if}
			</div>
		{/each}
	{/await}
</div>
