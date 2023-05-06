import { getVehicle } from '$lib/vehicleImages';
import { error } from '@sveltejs/kit';
import type { vehicleSearched } from '$lib/vehicle';
import type { Collection } from 'mongodb';
import type { stopDB } from '$lib/stopDB';
import type { trip } from '$lib/trip';

export async function load({ locals, params, depends }) {
    depends('vehicle');

    const { stops, trips } = locals;

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
            promise: findRoute(outId, stops, trips)
        }
    };
}

async function findRoute(code: string, trips: Collection<trip>, stops: Collection<stopDB>) {
    try {
        const res = await fetch(`/api/find-vehicle/${code}`);
        const json = await res.json() as foundVehicle;

        json.db = await getTripData(json.trip_id, trips, stops);

        return json;
    } catch (e) {
        return null;
    }
}

async function getTripData(trip_id: string, trips: Collection<trip>, stops: Collection<stopDB>) {
    const trip = await trips.findOne({ trip_id }, { projection: { _id: 0, destination: 1, shape: 1, stops: 1 } });
    const stopCodes = trip?.stops.map(el => el.code) ?? [];
    const stopsArr = await stops.find({code: {$in: stopCodes}}, {projection: {_id: 0, city: 0, }}).toArray();

    return {
        destination: trip?.destination as string,
        shape: trip?.shape as number[][],
        stops: stopsArr
    } satisfies dbData;
}

interface foundVehicle extends vehicleSearched {
    db: dbData
}

interface dbData {
    destination: string,
    shape: number[][],
    stops: stopDB[],
}
