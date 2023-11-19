<script lang="ts">
	import { DateTime } from 'luxon';

	export let time: Date; //TS treats time as a Date but it's actually a string

	const timeObj = DateTime.fromJSDate(new Date(time));
	const diff = timeObj
		.diff(DateTime.local({ zone: 'Europe/Rome' }), ['hours', 'minutes', 'seconds'])
		.toObject();

	let hours = diff.hours || 0;
	let minutes = diff.minutes || 0;
	let seconds = Math.floor(diff.seconds || 0);

	const id = setInterval(() => {
		const diff = timeObj
			.diff(DateTime.local({ zone: 'Europe/Rome' }), ['hours', 'minutes', 'seconds'])
			.toObject();

		hours = diff.hours || 0;
		minutes = diff.minutes || 0;
		seconds = Math.floor(diff.seconds || 0);

		if (hours === 0 && minutes === 0 && seconds === 0) clearInterval(id);
	}, 1000);
</script>

{#if hours > 0}
	<span style="--value:{hours};" />:
{/if}
{#if minutes >= 0}
	<span style="--value:{minutes};" />:
{:else}
	<span style="--value:00;" />:
{/if}
{#if seconds >= 0}
	<span style="--value:{seconds};" />
{:else}
	<span style="--value:00;" />
{/if}
