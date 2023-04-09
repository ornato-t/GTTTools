import type { PageLoad } from './$types';
import { getVehicle } from '$lib/vehicleImages';
import { error } from '@sveltejs/kit';

export const load = (async ({ params }) => {
    const code = params.vehicle;

    const res = getVehicle(code);

    if (res === null) throw error(404, 'No matching vehicle found');

    return {
        code,
        url: res.url,
        info: res.info ?? ''
    };
}) satisfies PageLoad;