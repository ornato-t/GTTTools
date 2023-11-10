import type { stopDB } from '$lib/stopDB.js';
import type { stop } from '$lib/stop.js';
import type { vehicleMap } from '$lib/vehicle.js';
import { poll } from '$lib/poll/route.js';
import type { LatLngExpression } from "leaflet";
import type { Collection } from 'mongodb';


const COLOURS = ["#ff0000", "#0041ff", "#23c043", "#c000b4", "#00deda", "#e8781a"]
const STOP_NUM = 50;

export async function load({ locals, parent, depends }) {
    depends('stop_lines');

    const parentData = await parent();

    const { stops } = locals;
    const coords = [parentData.db.coordinates[1], parentData.db.coordinates[0]] as LatLngExpression;    //Need to swap coords, mongo wants [lon, lat]; leaflet wants [lat, lon]


    return {
        coords,
        vehicles: { promise: getVehicles(parentData.api.promise) },
        near: getNear(stops, parentData.db, parentData.code),
    };
}

async function getNear(stops: Collection<stopDB>, db: stopDB, code: number) {
    const query = { coordinates: { $nearSphere: { $geometry: { type: 'point', coordinates: db.coordinates } } }, code: { $ne: code } }
    const projection = { _id: 0, city: 0 }

    const res = await stops.find(query).limit(STOP_NUM).project(projection).toArray() as stopDB[];
    return res.map(r => ({
        code: r.code,
        name: r.name,
        description: r.description,
        coordinates: [r.coordinates[1], r.coordinates[0]],
        metro: r.metro,
        train: r.train,
        trainCode: r.trainCode
    })) satisfies stopDB[];
}

async function getVehicles(stopAPI: Promise<stop[]>) {
    const stop = await stopAPI;
    const out: Array<vehicleMap> = [];

    let i = 0;
    for (const line of stop) {
        const data = await poll(line.routeID);

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

    if (index > available) return COLOURS[available % index];

    return COLOURS[index];
}