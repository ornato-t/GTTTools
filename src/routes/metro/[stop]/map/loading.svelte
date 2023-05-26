<script>
    let dots = '...';

	setInterval(() => {
		if(dots.length !== 3) dots+='.';
		else dots = '';
	}, 400)
</script>

<i class='bx bxs-bus bx-xs rounded-full p-0.5 bg-base-200 border border-base-content animate-pulse place-self-center'/>
<div class="animate-pulse w-full justify-self-end col-span-2" >
    Caricamento{dots}
</div>
