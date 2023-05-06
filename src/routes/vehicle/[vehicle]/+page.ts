import { getVehicle } from '$lib/vehicleImages';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
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
        creditsLink: res.creditsLink,
        creditsSiteName: res.creditsSiteName,
        info: res.info ?? null,
        route: {
            promise: findRoute(outId)
        }
    };
}) satisfies PageLoad;

async function findRoute(code: string) {
    try {
        const res = await fetch(`/api/find-vehicle/${code}`);
        const json = await res.json() as vehicleSearched | null;

        return json;
    } catch (e) {
        return null;
    }
}