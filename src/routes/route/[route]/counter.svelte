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

		if (diff.seconds < 60) return formatter.format(Math.round(diff.seconds * -1), 'seconds');
		else return formatter.format(getMinutes(diff.seconds) * -1, 'minutes');
	}

	function getMinutes(seconds: number) {
		return Math.round(seconds / 60);
	}
</script>

{displayedTime}
