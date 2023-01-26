import type { stop } from '$lib/stop';
import fetch from '$lib/proxyRequest';

export default async function getStop(stop: number) {
    const station = await fetch(`/proxy/stop/${stop}`);

    if (station.status !== 200) {
        const err = await station.json();
        throwError(err.message)
    }

    return station.json() as Promise<stop[]>;
}

//I need to do this because throwing inside an async function causes an unhandled rejection error
function throwError(e: unknown){
    throw e;
}