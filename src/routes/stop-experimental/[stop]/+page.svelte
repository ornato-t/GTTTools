<script lang="ts">
	import type { PageData } from './$types';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Timer from './timer.svelte';

	export let data: PageData;

	//Refresh data every 5 seconds
	onMount(() => setInterval(() => invalidate('stop'), 5000));

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

<div class="p-4">
	<h1 class="mb-4 text-xl font-semibold uppercase">{data.code} - {data.db.name}</h1>
	<h2 class="font-light">{data.db.description}</h2>
</div>

<!-- Desktop -->
<div class="hidden lg:grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-2">
	{#if data.api.length !== 0}
		{#key data.api}
			{#each data.api as pass}
				<a href="/route/{pass.route}" data-sveltekit-preload-data>
					<div class="card w-96 h-full bg-neutral hover:bg-neutral-focus text-neutral-content shadow-xl">
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
												<Timer {time} />
											</div>
										{/each}
									</div>

									<!-- {#if !pass.realTime}
										<div class="divider mb-0 mt-4" />
										<div class="italic text-sm w-fit mx-auto opacity-60">
											Informazioni in tempo reale non disponibili
										</div>
									{/if} -->
								</div>
							{:else}
								<p>Nessuna informazione disponibile</p>
							{/if}
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
	{#if data.api.length !== 0}
		{#key data.api}
			{#each data.api as pass}
				<div class="card card-compact w-[22rem] h-full bg-neutral hover:bg-neutral-focus text-neutral-content shadow-xl">
					<a href="/route/{pass.route}" data-sveltekit-preload-data>
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
												<Timer {time} />
											</div>
										{/each}
									</div>

									<!-- {#if !pass.realTime}
										<div class="divider mb-0 mt-4" />
										<div class="italic text-sm w-fit mx-auto opacity-60">
											Informazioni in tempo reale non disponibili
										</div>
									{/if} -->
								</div>
							{:else}
								<p>Nessuna informazione disponibile</p>
							{/if}
						</div>
					</a>
				</div>
			{/each}
		{/key}
		{:else}
		<div class="font-light px-4">Nessuna informazione in tempo reale disponibile.</div>
	{/if}
</div>
