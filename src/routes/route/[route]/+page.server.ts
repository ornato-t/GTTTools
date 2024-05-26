import type { routeDB } from '$lib/routeDB';
import type { Collection } from "mongodb";
import type { stopDB } from '$lib/stopDB.js';
import type { trip, trip_stop } from '$lib/trip.js';
import { poll } from '$lib/poll/route.js';

export const load = (async ({ params, locals, depends }) => {
    depends('vehicle');

    const code = params.route;
    const { stops, trips, routes } = locals;
    const shapeColours = ['#fb3735', '#436cdc']
    const pinColours = ['#fb7c7b', '#859fe3']

    const tripData = await getTrip(code, trips);

    return {
        code,
        db: getDB(code, routes),
        routes: tripData.map((el, i) => ({
            shape: el.shape,
            shapeColour: shapeColours[i],
            stops: { promise: getStops(el.stops, stops) },
            pinColour: pinColours[i]
        })),
        api: { promise: poll(code) },
    }
});


async function getDB(code: string, routes: Collection<routeDB>) {
    const route = routes.findOne({ "code.internal": code }, { projection: { _id: 0 } }) as Promise<routeDB>;

    return route;
}

//Return an appropriate trip info for a rotue
async function getTrip(route: string, trips: Collection<trip>) {
    const aggr = [
        { $match: { route, "dates.startDate": { $lte: new Date() }, "dates.endDate": { $gte: new Date() }, [getDay()]: true } },
        { $facet: { one: [{ $match: { direction: 1 } }, { $sample: { size: 1 } }], zero: [{ $match: { direction: 0 } }, { $sample: { size: 1 } }] } },
        { $project: { result: { $concatArrays: ['$one', '$zero'] } } },
        { $unwind: '$result' },
        { $replaceRoot: { newRoot: '$result' } },
        { $project: { _id: 0, stops: 1, shape: 1, destination: 1 } }
    ];

    const fallbackAggr = [
        { $match: { route, "dates.startDate": { $lte: new Date() }, "dates.endDate": { $gte: new Date() } } },
        { $facet: { one: [{ $match: { direction: 1 } }, { $sample: { size: 1 } }], zero: [{ $match: { direction: 0 } }, { $sample: { size: 1 } }] } },
        { $project: { result: { $concatArrays: ['$one', '$zero'] } } },
        { $unwind: '$result' },
        { $replaceRoot: { newRoot: '$result' } },
        { $project: { _id: 0, stops: 1, shape: 1, destination: 1 } }
    ];

    let res = await trips.aggregate<trip>(aggr).toArray();  //First test with stricter match

    if (res.length === 0) {    //Run query twice if it has yielded no results. This is more likely to succeed
        res = await trips.aggregate<trip>(fallbackAggr).toArray();  //Then fallback to more lax query
    }

    return res

    //Get the current weekday and return an appropriate date query
    function getDay() {
        const d = new Date();

        switch (d.getDay()) {
            case 0:
                return "dates.sunday";
            case 1:
                return "dates.monday";
            case 2:
                return "dates.tuesday";
            case 3:
                return "dates.wednesday";
            case 4:
                return "dates.thursday";
            case 5:
                return "dates.friday";
            case 6:
                return "dates.saturday";
            default:    //This shouldn't happen
                return "dates.monday";
        }
    }
}

//Returns the position of all scheduled stops for a trip
async function getStops(stopList: trip_stop[], stops: Collection<stopDB>) {
    const ids = stopList.map(el => el.code);  //IDs of all the programmed stops for the queried line

    const aggr = [
        { $match: { code: { $in: ids } } },                                                                                 //Filter stops
        { $addFields: { coordinates: [{ $arrayElemAt: ["$coordinates", 1] }, { $arrayElemAt: ["$coordinates", 0] }] } },    //Reverse coords array (Mongo wants them saved as [lon, lat])
        { $project: { _id: 0 } },                                                                                           //Project only necessary fields
    ]

    return stops.aggregate<{ name: string, description: string, code: number, coordinates: number[] }>(aggr).toArray();
}
