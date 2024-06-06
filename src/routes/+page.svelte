<script>
	import Footer from "./footer.svelte";
	import { seo } from '$lib/stores/seo';

	$seo.title = 'GTTTools: infomobilità reinventata';
	$seo.description = "Un nuovo modo per vivere i mezzi pubblici nella Città di Torino e in Piemonte. Una soluzione moderna per l'infomobilità: semplice, veloce e pensato per le esigenze dei pendolari";
</script>
<div class="grid w-full lg:min-h-screen bg-base-200 lg:pb-6 lg:grid-cols-2 gap-y-4 lg:gap-y-0 scrollable">
  <div class="hero-content flex-col lg:flex-row place-self-start lg:my-auto lg:h-fit w-full">
		<i class="bx bx-search-alt-2 bx-tada-hover border-2 p-6 rounded-2xl border-base-content text-9xl text-base-content hover:bg-base-100 " />
	<div class="grid">
		<h1 class="text-5xl font-bold">Cerca una fermata</h1>
		<span class="py-6">
			<p>Cerca una fermata usando il suo nome, indirizzo o codice numerico.</p>
			<p>Segui in tempo reale i passaggi di mezzi e linee.</p>
			<p class="invisible h-0">This is a bunch of junk, useless placeholder test. You aren't supposed to see this. If you are seeing this please stop now. If you're wondering why I put this here, I have to otherwise the spacing on the page breaks and I'm too lazy to figure out an actual solution.</p>
		</span>
      <a href="/stop/search" class="btn lg:btn-lg btn-primary lg:place-self-end">cerca</a>
    </div>
  </div>
	<div class="hidden lg:block"/>
	<div class="hidden lg:block"/>
  <div class="hero-content flex-col lg:flex-row-reverse place-self-end lg:my-auto lg:h-fit w-full">
		<i class="bx bx-current-location bx-tada-hover border-2 p-6 rounded-2xl border-base-content text-9xl text-base-content hover:bg-base-100 " />
	<div class="grid">
	  <h1 class="text-5xl font-bold">Fermate vicino a te</h1>
	  	<span class="py-6">
			<p>Usa il GPS del tuo dispositivo per trovare le fermate più vicine alla tua posizione.</p>
			<p>Segui in tempo reale i passaggi di mezzi e linee.</p>
			<p class="invisible h-0">This is a bunch of junk, useless placeholder test. You aren't supposed to see this. If you are seeing this please stop now. If you're wondering why I put this here, I have to otherwise the spacing on the page breaks and I'm too lazy to figure out an actual solution.</p>
		</span>
	  <a href="/stop/gps" class="btn lg:btn-lg btn-primary lg:place-self-start">posizione</a>
	</div>
  </div>
  <div class="hidden lg:block"/>
  <div class="hidden lg:block"/>
  <div class="hero-content flex-col lg:flex-row place-self-start lg:my-auto lg:h-fit w-full">
		<i class="bx bx-map bx-tada-hover border-2 p-6 rounded-2xl border-base-content text-9xl text-base-content hover:bg-base-100 " />
	<div class="grid">
		<h1 class="text-5xl font-bold">Cerca una linea</h1>
	  <span class="py-6">
		  <p>Cerca una linea usando il suo numero, il tipo di mezzo impiegato o la destinazione.</p>
		  <p>Osserva i movimenti dei mezzi in tempo reale su una mappa della Città.</p>
		  <p class="invisible h-0">This is a bunch of junk, useless placeholder test. You aren't supposed to see this. If you are seeing this please stop now. If you're wondering why I put this here, I have to otherwise the spacing on the page breaks and I'm too lazy to figure out an actual solution.</p>
	  </span>
	  <a href="/route/search" class="btn lg:btn-lg btn-primary lg:place-self-end">cerca</a>
	</div>
  </div>
	<div class="hidden lg:block"/>
	<div class="hidden lg:block"/>
  <div class="hero-content flex-col lg:flex-row-reverse place-self-end lg:my-auto lg:h-fit w-full">
		<i class="bx bx-bus bx-tada-hover border-2 p-6 rounded-2xl border-base-content text-9xl text-base-content hover:bg-base-100 " />
	<div class="grid">
		<h1 class="text-5xl font-bold">Trova un veicolo</h1>
		<span class="py-6">
			<p>Trova la linea su cui è un servizio un veicolo, la sua posizione in tempo reale e una sua immagine.</p>
			<p class="invisible h-0">This is a bunch of junk, useless placeholder test. You aren't supposed to see this. If you are seeing this please stop now. If you're wondering why I put this here, I have to otherwise the spacing on the page breaks and I'm too lazy to figure out an actual solution.</p>
		</span>
	  <a href="/vehicle/search" class="btn lg:btn-lg btn-primary lg:place-self-start">trova</a>
	</div>
  </div>
  <div class="hidden lg:block"/>
  <div class="hidden lg:block"/>
  <div class="hero-content flex-col lg:flex-row place-self-end lg:my-auto lg:h-fit w-full">
		<i class="bx bx-train bx-tada-hover border-2 p-6 rounded-2xl border-base-content text-9xl text-base-content hover:bg-base-100 " />
	<div class="grid">
		<h1 class="text-5xl font-bold">Metro</h1>
		<span class="py-6">
			<p>Cerca una stazione della metropolitana e visualizza i passaggi in programma.</p>
			<p class="invisible h-0">This is a bunch of junk, useless placeholder test. You aren't supposed to see this. If you are seeing this please stop now. If you're wondering why I put this here, I have to otherwise the spacing on the page breaks and I'm too lazy to figure out an actual solution.</p>
		</span>
	  <a href="/metro/search" class="btn lg:btn-lg btn-primary lg:place-self-end">metro</a>
	</div>
  </div>
  <div class="hidden lg:block"/>
  <div class="hidden lg:block"/>
  <div class="hero-content flex-col lg:flex-row-reverse place-self-end lg:my-auto lg:h-fit w-full">
		<i class="bx bxs-train bx-tada-hover border-2 p-6 rounded-2xl border-base-content text-9xl text-base-content hover:bg-base-100 " />
	<div class="grid">
		<h1 class="text-5xl font-bold">Servizio Ferroviario Metropolitano</h1>
		<span class="py-6">
			<p>Sfrutta la linea ferroviaria e i treni SFM per attraversare rapidamente la città.</p>
			<p class="invisible h-0">This is a bunch of junk, useless placeholder test. You aren't supposed to see this. If you are seeing this please stop now. If you're wondering why I put this here, I have to otherwise the spacing on the page breaks and I'm too lazy to figure out an actual solution.</p>
		</span>
	  <a href="/sfm/search" class="btn lg:btn-lg btn-primary lg:place-self-start">treni</a>
	</div>
  </div>
  <div class="hidden lg:block"/>
  <div class="hidden lg:block"/>
  <div class="hero-content flex-col lg:flex-row place-self-end lg:my-auto lg:h-fit w-full">
	<i class="bx bx-error bx-tada-hover border-2 p-6 rounded-2xl border-base-content text-9xl text-base-content hover:bg-base-100 " />
	<div class="grid">
		<h1 class="text-5xl font-bold">Scioperi</h1>
		<span class="py-6">
			<p>Visualizza i prossimi scioperi in programma. </p>
			<p>Aggiornato con dati ufficiali forniti dal Ministero dei Trasporti.</p>
			<p class="invisible h-0">This is a bunch of junk, useless placeholder test. You aren't supposed to see this. If you are seeing this please stop now. If you're wondering why I put this here, I have to otherwise the spacing on the page breaks and I'm too lazy to figure out an actual solution.</p>
		</span>
	  <a href="/strikes" class="btn lg:btn-lg btn-primary lg:place-self-end">controlla</a>
	</div>
  </div>
  <div class="hidden lg:block"/>

  	<!-- Hiding footer on desktop, it is added in the layout -->
	<Footer css={"lg:hidden"}/>
</div>
