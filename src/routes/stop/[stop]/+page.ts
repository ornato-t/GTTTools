import type { stop } from '$lib/stop';
import type { stopDB } from '$lib/stopDB';

export const load: any = async ({ params }) => {
    const stop: Promise<stop[]> = getStop(params.stop);
    const data: Promise<stopDB> = await getDB(params.stop)
    return {
        code: params.stop,
        api: stop,
        db: data
    };
}

async function getStop(stop: number) {
    const station = await fetch(`https://tools.gtt.cx/proxy/stop/${stop}.json`);
    const data = await station.json();
    return data as stop[];
}

async function getDB(stop: number) {
    const station = await fetch(`https://tools.gtt.cx/api/db/stop/${stop}`);
    const data = await station.json();
    return data as stopDB;
}