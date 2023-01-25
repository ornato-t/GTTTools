<script lang="ts">
	import type { stop } from '$lib/stop';
	import type { PageData } from './$types';
	import getStop from './getStop';
	import Timer from './timer.svelte';

	export let data: PageData;

	const SEC_REFRESH = 30;

	let api = new Array<stop>();

	poll(data.code, 1000 * SEC_REFRESH);

	async function poll(code: number, interval: number) {
		api = await getStop(data.code);

		setInterval(async () => {
			api = await getStop(code);
		}, interval);
	}

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

<h1 class="mb-4 text-xl font-semibold uppercase">{data.code} - {data.db.name}</h1>
<h2 class="my-4 font-light">{data.db.description}</h2>

<!-- Desktop -->
<div class="hidden lg:grid grid-cols-4 gap-4 mt-2">
	{#if api.length !== 0}
		{#key api}
			{#each api as pass}
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
												<Timer {time} />
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
		{/key}
	{:else}
		Loading...
	{/if}
</div>

<div class="lg:hidden">
	Stronzoh, ti ho detto che non funziona su mobile
</div>