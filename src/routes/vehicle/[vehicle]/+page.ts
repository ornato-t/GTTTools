import type { PageLoad } from './$types';
import { getVehicle } from '$lib/vehicleImages';
import { error } from '@sveltejs/kit';
import type { vehicleSearched } from '$lib/vehicle';

export const load = (async ({ params, depends }) => {
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
        info: res.info ?? null,
        route: {
            promise: findRoute(outId)
        }
    };
}) satisfies PageLoad;

//TODO: poll every route of the vehicle API until a match is found. This is probably going to need a proxy of its own
async function findRoute(code: string) {
    try {
        const res = await fetch(`/api/find-vehicle/${code}`);
        const json = await res.json() as vehicleSearched | null;

        return json;
    } catch (e) {
        return null;
    }
}