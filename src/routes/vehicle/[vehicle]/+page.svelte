<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>


<div>
	Veicolo numero {data.code}
</div>

<div class="w-fit mx-auto">
	<img src="/api/image?url={data.url}" alt="Veicolo numero {data.code}" class="max-h-96"/>
	<span class="text-sm italic">
		Foto a cura di {data.credits}
	</span>
</div>

{data.info}