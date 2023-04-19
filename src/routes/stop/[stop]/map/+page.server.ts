import type { stopDB } from '$lib/stopDB.js';

const STOP_NUM = 50;

export async function load({ locals, parent }) {
    const parentData = await parent();

    const { stops } = locals;

    const query = { coordinates: { $nearSphere: { $geometry: { type: 'point', coordinates: parentData.db.coordinates } } }, code: { $ne: parentData.code } }
    const projection = { _id: 0, city: 0 }

    const res = await stops.find(query).limit(STOP_NUM).project(projection).toArray() as stopDB[];
    const near = res.map(r => {
        return {
            code: r.code,
            name: r.name,
            description: r.description,
            coordinates: [r.coordinates[1], r.coordinates[0]],
            metro: r.metro,
            train: r.train,
            trainCode: r.trainCode
        }
    }) satisfies stopDB[];

    return {
        near
    };
}
