<script lang="ts">
	import { DateTime } from 'luxon';

	export let time: Date;

	let displayedTime = relativeDate(time);

	setInterval(() => (displayedTime = relativeDate(time)), 1000);

	function relativeDate(d: Date) {
		const target = DateTime.fromJSDate(new Date(d));
		const diff = DateTime.local({ zone: 'Europe/Rome' }).diff(target, ['seconds']);

		const formatter = new Intl.RelativeTimeFormat('it-it', {
			numeric: 'always',
			style: 'short'
		});

		return formatter.format(Math.round(diff.seconds * -1), 'seconds');
	}
</script>

{displayedTime}
