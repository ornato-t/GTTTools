<script lang="ts">
	import type { PageData } from './$types';
    import Loading from './loading.svelte';

	export let data: PageData;

    function printDate(d: Date){
        return new Date(d).toLocaleDateString()
    }
</script>
<div class="p-4">
	<h1 class="mb-2 text-xl font-semibold">Scioperi programmati </h1>
</div>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2 mb-10 mx-2 lg:mx-0">
    {#await data.api.promise}
		<Loading />
		<Loading />
		<Loading />
		<Loading />
		<Loading />
		<Loading />
    {:then strikesList} 
        {#each strikesList as strike}
            <div class="card card-compact w-full h-full bg-neutral hover:bg-neutral-focus text-neutral-content shadow-xl">
                <div class="card-body p-6">
                <h2 class="card-title text-2xl text-left">{printDate(strike.dateEnd)}</h2>
                    <h3 class="card-title text-sm font-light text-right">
                        {strike.mode}
                    </h3>
                    <div class="justify-end">
                        <div class="w-full">
                            <div class="text-left mb-2">
                                <span class="font-mono">{strike.category}</span> 
                            </div>
                            <div class="text-left">
                                Ambito: <span class="font-mono">{strike.scope}</span> 
                            </div>
                            <div class="text-left">
                                Settore: <span class="font-mono">{strike.sector}</span> 
                            </div>
                            <div class="text-left">
                                Provincia: <span class="font-mono">{strike.province}</span> 
                            </div>
                            <span class="text-xs grid grid-cols-2 mt-2">
                                <div class="text-left">
                                    Proclamazione: <span class="font-mono">{printDate(strike.dateSubmission)}</span> 
                                </div>
                                <div class="text-right">
                                    Sindacati: <span class="font-mono">{strike.unions}</span> 
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    {/await}
</div>
