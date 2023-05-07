import { getVehicle } from '$lib/vehicleImages';
import { error } from '@sveltejs/kit';
import type { vehicleSearched } from '$lib/vehicle';
import type { Collection } from 'mongodb';
import type { stopDB } from '$lib/stopDB';
import type { trip } from '$lib/trip';

export async function load({ locals, params, depends, fetch }) {
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
        link: res.link,
        siteName: res.siteName,
        info: res.info ?? null,
        type: res.type,
        route: {
            promise: findRoute(outId, stops, trips, fetch)
        }
    };
}

async function findRoute(code: string, stops: Collection<stopDB>, trips: Collection<trip>, fetch: (arg0: string) => Promise<Response>) {
    try {
        const res = await fetch(`/api/find-vehicle/${code}`);
        const json = await res.json() as foundVehicle;

        json.db = await getTripData(json.trip_id, stops, trips);

        return json;
    } catch (e) {
        return null;
    }
}

async function getTripData(trip_id: string, stops: Collection<stopDB>, trips: Collection<trip>,) {
    const trip = await trips.findOne({ trip_id }, { projection: { _id: 0 } });
    const stopCodes = trip?.stops.map(el => el.code) ?? [];
    const stopsArr = await stops.find({code: {$in: stopCodes}}, {projection: {_id: 0, city: 0, }}).toArray();

    return {
        destination: trip?.destination as string,
        shape: trip?.shape as number[][],
        stops: stopsArr
    } satisfies dbData;
}

export interface foundVehicle extends vehicleSearched {
    db: dbData
}

interface dbData {
    destination: string,
    shape: number[][],
    stops: stopDB[],
}
