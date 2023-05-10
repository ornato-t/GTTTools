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

        json.db = await getTripData(json.trip_id, json.route, stops, trips);

        return json;
    } catch (e) {
        return null;
    }
}

async function getTripData(trip_id: string, route: string, stops: Collection<stopDB>, trips: Collection<trip>,) {
    let trip = await trips.findOne({ trip_id }, { projection: { _id: 0 } }) as trip;
    if(trip === null) {
        trip = await getTrip(route, trips);
    }
  
    const stopCodes = trip?.stops.map(el => el.code) ?? [];
    const res = await stops.find({ code: { $in: stopCodes } }, { projection: { _id: 0, city: 0, } }).toArray();
    const stopsArr = res.map(r => ({
        code: r.code,
        name: r.name,
        description: r.description,
        coordinates: [r.coordinates[1], r.coordinates[0]],
        metro: r.metro,
        train: r.train,
        trainCode: r.trainCode
    })) satisfies stopDB[];

    return {
        destination: trip?.destination as string,
        shape: trip?.shape as number[][],
        stops: stopsArr
    } satisfies dbData;
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

    if (res.length === 0) throw error(404, 'No matching route found');

    return res[0]

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


export interface foundVehicle extends vehicleSearched {
    db: dbData | null
}

interface dbData {
    destination: string,
    shape: number[][],
    stops: stopDB[],
}
