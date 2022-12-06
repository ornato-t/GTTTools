<script lang="ts">
	import type { PageData } from './$types';

	function printLocale(d: Date) {
		d = new Date(d);
		return `${d.getHours()}:${d.getMinutes()}`;
	}

	export let data: PageData;
</script>

<h1>Stop {data.code}</h1>
{#each data.stopData as pass}
	Route {pass.line}
	{#each pass.realTime as time}
	<p>{printLocale(time)}</p>	
	{/each}
{/each}
