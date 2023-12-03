import type { stopDB } from '$lib/stopDB.js';
import type { LatLngExpression } from "leaflet";
import type { Collection } from 'mongodb';

const STOP_NUM = 100;

export async function load({ locals, parent, depends }) {
    depends('stop_lines');

    const parentData = await parent();

    const { stops } = locals;
    const coords = [parentData.db.coordinates[1], parentData.db.coordinates[0]] as LatLngExpression;    //Need to swap coords, mongo wants [lon, lat]; leaflet wants [lat, lon]


    return {
        coords,
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
