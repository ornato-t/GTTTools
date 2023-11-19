<script lang="ts">
	export let css = '';
</script>

<!-- 
    The footer component is:
    - added to all non home pages on both viewports via the layout
    - added to the desktop home page via the layout (otherwise margins make it look ugly)
    - added to the mobile home page via the +page.svelte file (otherwise scrolling breaks)
-->

<footer class="footer p-10 bg-neutral text-neutral-content {css}">
	<div>
		<span class="footer-title">About</span>
		<a class="link link-hover" href="/about/me">Chi sono</a>
		<a class="link link-hover" href="/about/gtttools"> Perché GTTTools? </a>
		<a class="link link-hover" href="https://github.com/ornato-t/GTTTools"> GitHub </a>
	</div>
	<div>
		<span class="footer-title">Note legali</span>
		<a class="link link-hover" href="/about/privacy">Privacy</a>
		<a class="link link-hover" href="/about/data">Dati</a>
	</div>
</footer>
