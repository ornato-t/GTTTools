import { getVehicle } from '$lib/vehicleImages';
import { error } from '@sveltejs/kit';
import type { vehicleSearched } from '$lib/vehicle';

export async function load({ params, depends, data }) {
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
        route: data.route
    };
}