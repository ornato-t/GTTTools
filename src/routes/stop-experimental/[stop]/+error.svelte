<script>
	import { page } from '$app/stores';
</script>

<div class="alert alert-error shadow-lg mb-4">
    <div>
        <i class="bx bx-error-circle" />
        <span>Error {$page.status}!  {$page.error?.message}.</span>
    </div>
</div>
<div>
    {#if $page.status === 503}
        <p>
            I servizi GTT sono temporaneamente offline. Non è possibile visualizzare alcuna informazione.
        </p>
        <p>
            Se il problema persiste, prova a utilizzare la <a class="link" href="https://tools.gtt.cx/stop/search">pagina legacy</a>.
        </p>
    {:else}
        Si è verificato un errore interno a GTTTools. Se il problema persiste, contattare lo sviluppatore tramite <a class="link" href="https://github.com/ornato-t/GTTTools">GitHub</a>.
    {/if}
</div>