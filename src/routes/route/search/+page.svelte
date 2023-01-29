<script lang="ts">
	import Search from 'svelte-search';
	import type { routeDB } from '$lib/routeDB';
	import fetch from '$lib/proxyRequest';

	let value = '';
	let routes = new Array<routeDB>();

	async function searchDB(route: string) {
		if (route.length > 0) {
			const res = await fetch(`/proxy/search-route/${route}`);
			routes = await res.json();
		}
	}
</script>

<div class="form-control w-full max-w-xs mx-auto lg:mx-0">
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label class="label">
		<span class="label-text">Inserisci il codice di una linea o la sua destinazione</span>
	</label>
	<Search
		label=""
		placeholder="Cerca"
		autofocus
		bind:value
		on:type={() => searchDB(value)}
		class="input input-bordered w-full max-w-xs"
	/>
</div>

<div class="mx-4 lg:mx-auto py-2 lg:grid lg:grid-cols-2 lg:gap-x-4">
	{#if routes != undefined && value.length > 0}
		{#each routes as route}
			<a
				class="my-1 card card-compact bg-base-200 btn h-fit animate-none"
				href="/route/{route.code}"
				data-sveltekit-preload-data
			>
				<div class="card-body w-full grid grid-cols-4">
					<span class=" text-primary card-title">{route.code}</span>
					<span class="text-secondary col-span-3  py-1"> {route.type} • {route.provider.replace('GTT Servizio ', '')}</span>
					<span class="col-span-4 text-xs italic place-self-start">{route.name}</span>
				</div>
			</a>
		{/each}
	{/if}
</div>
