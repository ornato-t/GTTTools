<script lang="ts">
	import type { PageData } from './$types';

    export let data: PageData;
</script>

<p>Latitudine: {data.lat}</p>
<p>Longitudine: {data.lon}</p>
<p>Precisione: {data.acc}m</p>