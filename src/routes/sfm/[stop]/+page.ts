import type { stop } from '$lib/stop';
import fetch from '$lib/proxyRequest';
import { error } from '@sveltejs/kit';

//The data from the DB is passed to this load function. It depends by stop, so invalidating that (in .svelte) refreshes this
export async function load({ data, depends }) {
    depends('sfm')

    return {
        code: data.code,
        db: data.db,
        api: { promise: getStop(data.code) },   //Nested promise leverages the streaming API. It's awaited on the client side
    };

}

//We still need the internal API as a proxy to get around CORS
async function getStop(stop: number) {
    const station = await fetch(`/api/stop/${stop}`);

    if (station.status !== 200) {
        const err = await station.json();
        throw error(err.status ?? 500, { message: err.message });
    }

    return station.json() as Promise<stop[]>;
}
