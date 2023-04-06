<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Loading from './loading.svelte';
	import Timer from './timer.svelte';
	import type { stop } from '$lib/stop';

	export let data: PageData;

	let api = new Array<stop>;

	//Refresh data every 5 seconds
	onMount(async () => {
		api = await data.api.promise	//First refresh the data

		setInterval(async () => {
			await invalidate('stop');		//Wait for page reload
			api = await data.api.promise	//Then refresh the data
		}, 5000)
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

<div class="p-4">
	<h1 class="mb-4 text-xl font-semibold uppercase">{data.code} - {data.db.name}</h1>
	<h2 class="font-light">{data.db.description}</h2>
</div>

<!-- Desktop -->
<div class="hidden lg:grid grid-cols-2 xl:grid-cols-3 min-[1900px]:grid-cols-4 gap-4 mt-2">
	{#if api.length === 0}
		<Loading />
		<Loading />
		<span class="hidden xl:block">
			<Loading />
		</span>
		<span class="hidden 2xl:block">
			<Loading />
		</span>
	{:else} 
		{#key api}
			{#each api as pass}
				<a href="/route/{pass.route}" data-sveltekit-preload-data>
					<div class="card w-96 h-full bg-neutral hover:bg-neutral-focus text-neutral-content shadow-xl">
						<div class="card-body p-6">
							<h2 class="card-title  mb-4 grid grid-cols-4">
								<span class="text-2xl text-left">{pass.route}</span>
								<span class="text-sm font-light text-right col-span-3">
									{pass.direction}
								</span>
							</h2>
							<div class="justify-end">
								{#if pass.pass.length > 0}
									<div class="w-full grid grid-cols-3">
										{#each pass.pass as time}
											<div class="text-left {time.realTime ? '' : 'opacity-50'}">
												{printLocale(time.time)}
											</div>
											<div class="justify-end col-span-2 countdown font-mono {time.realTime ? '' : 'opacity-50'}">
												<Timer time={time.time} />
											</div>
										{/each}
									</div>
								{:else}
									<p>Nessuna informazione disponibile</p>
								{/if}
							</div>
						</div>
					</div>
				</a>
			{/each}
		{/key}
	{/if}
</div>

<!-- Mobile -->
<div class="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 mb-6 mx-auto place-items-center">
	{#if api.length === 0}
	<div class="mx-4 grid gap-y-4">
		<Loading />
		<Loading />
		<Loading />
		<Loading />
	</div>
	{:else} 
	{#key api}
			{#each api as pass}
				<div class="card card-compact w-[22rem] h-full bg-neutral hover:bg-neutral-focus text-neutral-content shadow-xl">
					<a href="/route/{pass.route}" data-sveltekit-preload-data>
						<div class="card-body p-6">
							{#if pass.pass.length > 0}
								<h2 class="card-title mb-4 grid grid-cols-4">
									<span class="text-2xl text-left">{pass.route}</span>
									<span class="text-sm font-light text-right col-span-3">
										{pass.direction}
									</span>
								</h2>
								<div class="justify-end">
									<div class="w-full grid grid-cols-3">
										{#each pass.pass as time}
											<div class="text-left {time.realTime ? '' : 'opacity-50'}">
												{printLocale(time.time)}
											</div>
											<div class="justify-end col-span-2 countdown font-mono {time.realTime ? '' : 'opacity-50'}">
												<Timer time={time.time} />
											</div>
										{/each}
									</div>
								</div>
							{:else}
								<p>Nessuna informazione disponibile</p>
							{/if}
						</div>
					</a>
				</div>
			{/each}
		{/key}
	{/if}
</div>

