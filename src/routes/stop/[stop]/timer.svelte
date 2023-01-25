<script lang="ts">
	export let time: Date;
	time = new Date(time);

	const diff = new Date(time.getTime() - Date.now());

	let hours = diff.getHours();
	let minutes = diff.getMinutes();
	let seconds = diff.getSeconds();

	const id = setInterval(() => {
			const diff = new Date(time.getTime() - Date.now());

			hours = diff.getHours();
			minutes = diff.getMinutes();
			seconds = diff.getSeconds();

			if (hours === 0 && minutes === 0 && seconds === 0) clearInterval(id);
	}, 1000);
</script>

<span style="--value:{hours};" />:
<span style="--value:{minutes};" />:
<span style="--value:{seconds};" />
