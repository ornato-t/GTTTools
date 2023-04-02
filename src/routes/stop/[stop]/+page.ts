import type { stop } from '$lib/stop';
import fetch from '$lib/proxyRequest';
import { error } from '@sveltejs/kit';

export async function load({ data, depends }) {

    depends('stop')

    return {
        code: data.code,
        db: data.db,
        api: getStop(data.code),
    };

}

async function getStop(stop: number) {
    const station = await fetch(`/api/stop/${stop}`);

    if (station.status !== 200) {
        const err = await station.json();
        throw error(err.status ?? 500, { message: err.message });
    }

    return station.json() as Promise<stop[]>;
}
