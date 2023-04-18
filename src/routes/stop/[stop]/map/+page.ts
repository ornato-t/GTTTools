import { error } from '@sveltejs/kit';
import type { LatLngExpression } from "leaflet";
import type { stop } from '$lib/stop.js';
import type { vehicle, vehicleMap } from '$lib/vehicle.js';

const COLOURS = ["#ff0000", "#f4ff00", "#0041ff", "#00ff33", "#ff00ef", "#00fffa"]

export async function load({ data, depends, fetch, parent }) {
    depends('stop_lines');
    
    const parentData = await parent();

    const coords = [parentData.db.coordinates[1], parentData.db.coordinates[0]] as LatLngExpression;    //Need to swap coords, mongo wants [lon, lat]; leaflet wants [lat, lon]

    return {
        coords,
        vehicles: { promise: getVehicles(parentData.api.promise, fetch) },
        near: data.near
    };
}


async function getVehicles(stopAPI: Promise<stop[]>, svelteFetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
    const stop = await stopAPI;
    const out: Array<vehicleMap> = [];

    let i = 0;
    for (const line of stop) {
        const code = line.routeID;

        let route: Response;
        try {   //Try to fetch from site first (faster)
            route = await svelteFetch(`/api/route/${code}`, { signal: AbortSignal.timeout(1000) });   //Send timeout if request takes longer than a seconds
        } catch (e) {   //If it fails, resort to experimental API
            route = await svelteFetch(`/api/route-experimental/${code}`);
        }

        if (!route.ok) {
            const err = await route.json();
            throw error(err.status ?? 500, { message: err.message });
        }

        const data = await route.json() as vehicle[];

        if (data.length > 0) {
            out.push({
                route: line.route,
                routeID: line.routeID,
                vehicles: data,
                colour: getColour(i)
            });
            i++;
        }
    }

    return out;
}

function getColour(index: number) {
    const available = COLOURS.length;

    if(index > available) return COLOURS[available % index];

    return COLOURS[index];
}