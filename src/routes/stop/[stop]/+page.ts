import type { stop } from '$lib/stop';
import type { stopDB } from '$lib/stopDB';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    const code = parseInt(params.stop);
    const stop: Promise<stop[]> = getStop(code);
    const data: Promise<stopDB> = getDB(code);
    return {
        code: code,
        api: stop,
        db: data
    };
}

async function getStop(stop: number) {
    const station = await fetch(`https://tools.gtt.cx/proxy/stop/${stop}`);
    const data = await station.json();
    return data as stop[];
}

async function getDB(stop: number) {
    const station = await fetch(`https://tools.gtt.cx/proxy/stopDB/${stop}`);
    const data = await station.json();
    return data as stopDB;
}