<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

{data.code}
{data.url}
{data.info}

<img src="/api/image/{data.url}" alt="Veicolo numero {data.code}" class="mx-auto h-full"/>
