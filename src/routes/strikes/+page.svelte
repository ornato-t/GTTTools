<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

    function printDate(d: Date){
        return new Date(d).toLocaleDateString()
    }
</script>

<div class="mb-10">
    {#await data.api.promise}
        Caricamento...
    {:then strikesList} 
        <h1 class="text-xl mb-4">
            Scioperi in programma:
        </h1>
        <div class="grid grid-cols-1 gap-6">
            {#each strikesList as strike}
                <div class="rounded-xl">
                    <div>
                        Categoria: <span class="font-mono">{strike.category}</span>
                    </div>
                    <div>
                        Modalità: <span class="font-mono">{strike.mode}</span>
                    </div>
                    <div>
                        Ambito: <span class="font-mono">{strike.scope}</span>
                    </div>
                    <div>
                        Data fine: <span class="font-mono">{printDate(strike.dateEnd)}</span>
                    </div>
                    <div>
                        Settori coinvolti: <span class="font-mono">{strike.sector}</span>
                    </div>
                    <div>
                        Sindacati coinvolti: <span class="font-mono">{strike.unions}</span>
                    </div>
                    <div>
                        Data proclamazione: <span class="font-mono">{printDate(strike.dateSubmission)}</span>
                    </div>
                </div>
            {/each}
        </div>
    {/await}
</div>
