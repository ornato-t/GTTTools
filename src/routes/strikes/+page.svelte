<script lang="ts">
	import type { PageData } from './$types';
    import Loading from './loading.svelte';

	export let data: PageData;

    function printDate(d: Date){
        return new Date(d).toLocaleDateString()
    }
</script>

<!-- TODO: adapt loading component -->
<!-- TODO: mobile -->

<!-- Desktop -->
<div class="hidden lg:grid grid-cols-2 gap-4 mt-2">
    {#await data.api.promise}
		<Loading />
		<!-- <Loading />
		<span class="hidden xl:block">
			<Loading />
		</span>
		<span class="hidden 2xl:block">
			<Loading />
		</span> -->
    {:then strikesList} 
        {#each strikesList as strike}
            <div class="card w-full h-full bg-neutral hover:bg-neutral-focus text-neutral-content shadow-xl">
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
                            <span class="text-sm grid grid-cols-3 mt-2">
                                <div class="text-left">
                                    Proclamazione: <span class="font-mono">{printDate(strike.dateSubmission)}</span> 
                                </div>
                                <div class="text-right col-span-2">
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

<!-- Mobile -->
<div class="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 mb-6 mx-auto place-items-center">
    {#await data.api.promise}
        Caricamento...
    {:then strikeList} 
        {#each strikeList as strike}
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
    {/await}
	<!-- {#if api.length === 0}
	<div class="mx-4 grid gap-y-4">
		<Loading />
		<Loading />
		<Loading />
		<Loading />
	</div>
	{:else} 
			{#each api as pass}
				<div class="card card-compact w-[22rem] h-full bg-neutral hover:bg-neutral-focus text-neutral-content shadow-xl">
					<a href="/route/{pass.route}" data-sveltekit-preload-data>
						<div class="card-body p-6">
							{#if pass.pass.length > 0}
								<h2 class="card-title mb-4 grid grid-cols-4">
									<span class="text-2xl text-left">{pass.route}</span>
									<span class="text-sm font-light text-right col-span-3">
										{pass.direction}
									</span>
								</h2>
								<div class="justify-end">
									<div class="w-full grid grid-cols-3">
										{#each pass.pass as time}
											<div class="text-left {time.realTime ? '' : 'opacity-50'}">
												{printLocale(time.time)}
											</div>
											<div class="justify-end col-span-2 countdown font-mono {time.realTime ? '' : 'opacity-50'}">
												<Timer time={time.time} />
											</div>
										{/each}
									</div>
								</div>
							{:else}
								<p>Nessuna informazione disponibile</p>
							{/if}
						</div>
					</a>
				</div>
			{/each}
	{/if} -->
</div>

