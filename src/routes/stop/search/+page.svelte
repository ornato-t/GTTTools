<script lang="ts">
	import Search from 'svelte-search';
	import type { stopDB } from '$lib/stopDB';

	let value = '';
	let stops = new Array<stopDB>();

	async function searchDB(stop: string) {
		if (stop.length > 0) {
			const res = await fetch(`https://tools.gtt.cx/proxy/search-stop/${stop}`);
			// const res = await fetch(`http://localhost:5173/proxy/search-stop/${stop}`);
			stops = await res.json();
		}
	}
</script>

<div class="form-control w-full max-w-xs mx-auto lg:mx-0">
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label class="label">
		<span class="label-text">Inserisci il nome o il codice di una fermata</span>
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

<div class="mx-auto py-2 lg:grid lg:grid-cols-2 lg:gap-x-4">
	{#if stops != undefined && value.length > 0}
		{#each stops as stop}
			<a
				class="card card-compact bg-neutral shadow-xl my-3"
				href="/stop/{stop.code}"
				data-sveltekit-preload-data
			>
				<div class="card-body">
					<h2 class="card-title break-words">{stop.name}</h2>

					{#if stop.description != undefined}
						<p>{stop.description}</p>
					{/if}

					{#if stop.city != undefined && stop.city != 'Torino'}
						<p>{stop.city}</p>
					{/if}

					<p>{stop.code}</p>
				</div>
			</a>
		{/each}
	{/if}
</div>
