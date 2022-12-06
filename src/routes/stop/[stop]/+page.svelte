<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Stop {data.code}</h1>
{#each data.stopData as pass}
	Route {pass.line}
	{#each pass.realTime as time}
	<p>{time}</p>	
	{/each}
{/each}
