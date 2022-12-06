import type { stop } from '$lib/stop';

export const load: any = async ({ params }) => {
    const stop: Promise<stop[]> = getStop(params.stop);
    return {
        code: params.stop,
        stopData: stop
    };
}

async function getStop(stop: number) {
    // const station = await fetch(`tools.gtt.cx/api/stop/${stop}.json`);
    const station = await fetch(`http://tools.gtt.cx/api/stop/${stop}.json`);
    const data = await station.json();
    return data as stop[];
}
