import { error } from '@sveltejs/kit';
import type { stopDB } from '$lib/stopDB.js';
import type { trip, trip_stop } from '$lib/trip.js';
import type { Collection } from 'mongodb';

export async function load({ locals, params }) {
    const route = params.route;
    const { stops, trips } = locals;

    const tripData = await getTrip(route, trips);

    return {
        trip: tripData,
        stops: { promise: getStops(tripData.stops, stops) }
    };
}

//Return an appropriate trip info for a rotue
//TODO: add date verification: week day / weekend day + is a holiday?
async function getTrip(route: string, trips: Collection<trip>) {
    const query = { route, "dates.friday": true };
    const projection = { _id: 0, stops: 1, shape: 1 };

    const res = await trips.findOne(query, { projection });

    if (res === null) throw error(404, 'No matching route found');

    return res
}

//Returns the position of all scheduled stops for a trip
async function getStops(stopList: trip_stop[], stops: Collection<stopDB>) {
    const ids = stopList.map(el => el.id);
    const query = { code: { "$in": ids } };
    const projection = { _id: 0, name: 1, description: 1, coordinates: 1 };

    const res = await stops.find(query, { projection }).toArray();

    if (res === null) return [];

    return res
}
