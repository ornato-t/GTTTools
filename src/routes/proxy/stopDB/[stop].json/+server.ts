import type { stopDB } from "$lib/stopDB";
import type { RequestHandler } from "@sveltejs/kit";

interface stopDBAPI {
    _id: string,    //It's actually a ObjectId but I can't use it here and would need to import a module just for that
    code: number,
    name: string,
    description: string,
    city: string,
    coordinates: number[]
}

export const GET: RequestHandler = async ({ params }) => {
    return new Response(JSON.stringify(await pollStop(params.stop as string)));
}

//Fetch all info regarding departing vehicles from a stop (by number)
export async function pollStop(stop: string) {
    const url = `https://www.gtt.to.it/cms/index.php?option=com_gtt&task=palina.getTransitiOld&palina=${stop}&realtime=true`;
    const options = {
        method: 'GET'
    };

    const response = await fetch(url, options);
    const stops: stopDBAPI = await response.json();
    const result: stopDB = {
        code: stops.code,
        name: stops.name,
        description: stops.description,
        coordinates: {
            lat: stops.coordinates[1],
            lon: stops.coordinates[0],
        }
    }

    return result;
}
