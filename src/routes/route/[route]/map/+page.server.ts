import { error } from '@sveltejs/kit';
import type { stopDB } from '$lib/stopDB.js';
import type { trip, trip_stop } from '$lib/trip.js';
import type { Collection } from 'mongodb';

export async function load({ locals, params }) {
    const route = params.route;
    const { stops, trips } = locals;

    const tripData = await getTrip(route, trips);

    return {
        shape: tripData.shape,
        stops: { promise: getStops(tripData.stops, stops) }
    };
}

//Return an appropriate trip info for a rotue
async function getTrip(route: string, trips: Collection<trip>) {
    const query = getQuery(route);
    const projection = { _id: 0, stops: 1, shape: 1 };

    const res = await trips.findOne<trip>(query, { projection });

    if (res === null) throw error(404, 'No matching route found');

    return res

    function getQuery(route: string) {
        const d = new Date();

        switch (d.getDay()) {
            case 0:
                return { route, "dates.sunday": true };
            case 1:
                return { route, "dates.monday": true };
            case 2:
                return { route, "dates.tuesday": true };
            case 3:
                return { route, "dates.wednesday": true };
            case 4:
                return { route, "dates.thursday": true };
            case 5:
                return { route, "dates.friday": true };
            case 6:
                return { route, "dates.saturday": true };
            default:
                return { route, dates: { "$exists": true } };
        }
    }
}

//Returns the position of all scheduled stops for a trip
async function getStops(stopList: trip_stop[], stops: Collection<stopDB>) {
    const ids = stopList.map(el => el.code);  //IDs of all the programmed stops for the queried line

    const aggr = [
        { $match: { code: { $in: ids } } },                                                                                 //Filter stops
        { $addFields: { coordinates: [{ $arrayElemAt: ["$coordinates", 1] }, { $arrayElemAt: ["$coordinates", 0] }] } },    //Reverse coords array (Mongo wants them saved as [lon, lat])
        { $project: { _id: 0, name: 1, description: 1, code: 1, coordinates: 1 } },                                         //Project only necessary fields
    ]

    return stops.aggregate<{ name: string, description: string, code: number, coordinates: number[] }>(aggr).toArray();
}
