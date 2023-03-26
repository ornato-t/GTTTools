import type { PageServerLoad } from './$types';
import type { stopDB } from "$lib/stopDB";

const STOP_NUM = 20

export const load: PageServerLoad = async ({ params, locals }) => {
    const { stops } = locals;
    const [lat, lon, acc] = params.coords.split(';');

    const query = { coordinates: { $nearSphere: { $geometry: { type: 'point', coordinates: [parseFloat(lat), parseFloat(lon)] } } } }
    const projection = { _id: 0, coordinates: 0, city: 0 }

    const cursor = stops.find(query).limit(STOP_NUM).project(projection).toArray() as Promise<stopDB[]>;

    return {
        stops: cursor,
        accuracy: acc
    };
}