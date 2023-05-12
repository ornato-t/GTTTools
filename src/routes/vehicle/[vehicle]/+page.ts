import { getVehicle } from '$lib/vehicleImages';
import { error } from '@sveltejs/kit';
import type { vehicleSearched } from '$lib/vehicle';

export async function load({ params, depends, fetch }) {
    depends('vehicle');

    const code = params.vehicle;

    const res = getVehicle(code);

    if (res === null) throw error(404, 'No matching vehicle found');

    let outId: string;
    if (res?.modifier !== undefined) outId = res.modifier.replace('_', `${res.code}`);
    else outId = `${res.code}`;

    return {
        code: outId,
        url: res.url,
        credits: res.credits,
        link: res.link,
        siteName: res.siteName,
        info: res.info ?? null,
        type: res.type,
        route: { promise: findRoute(outId, fetch)}  
    };
}

async function findRoute(code: string, fetch: (arg0: string) => Promise<Response>) {
    try {
        const res = await fetch(`/api/find-vehicle/${code}`);
        const json = await res.json() as vehicleSearched;

        return json;
    } catch (e) {
        return null;
    }
}
