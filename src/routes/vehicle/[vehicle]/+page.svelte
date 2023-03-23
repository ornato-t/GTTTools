<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<!-- {data.code} -->

<img src="/api/image/{data.code}" alt="Cat" class="mx-auto h-full"/>
