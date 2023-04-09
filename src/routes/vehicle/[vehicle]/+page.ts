import type { PageLoad } from './$types';
import { getVehicle } from '$lib/vehicleImages';
import { error } from '@sveltejs/kit';

export const load = (async ({ params }) => {
    const code = params.vehicle;

    const res = getVehicle(code);

    if (res === null) throw error(404, 'No matching vehicle found');
    console.log(res)
    let outId: string;
    if (res?.modifier !== undefined) outId = res.modifier.replace('_', `${res.code}`);
    else outId = `${res.code}`;


    return {
        code: outId,
        url: res.url,
        credits: res.credits,
        info: res.info ?? '',
    };
}) satisfies PageLoad;