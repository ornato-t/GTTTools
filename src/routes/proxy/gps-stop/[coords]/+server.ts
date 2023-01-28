import type { RequestHandler } from "@sveltejs/kit";
import type { stopDB } from "$lib/stopDB";

const STOP_NUM = 1

export const GET: RequestHandler = async ({ params, locals }) => {
    const { stops } = locals;
    const [lon, lat] = params.coords?.split(';') ?? ['0', '0'];

    if (isNaN(Number.parseInt(lat)) || isNaN(Number.parseInt(lon))) throw new Error('Invalid parameter');

    const query = { coordinates: { $nearSphere: { $geometry: { type: 'point', coordinates: [parseFloat(lon), parseFloat(lat)] } } } }
    const projection = { _id: 0, coordinates: 0, city: 0 }

    const resArray = await stops.find(query).limit(STOP_NUM).project(projection).toArray() as stopDB[];
    const res = resArray[0];

    return new Response(JSON.stringify(res));
}
