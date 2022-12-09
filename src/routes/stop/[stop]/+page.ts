import type { stop, stopWeb } from "$lib/stop";
import type { stopDB } from '$lib/stopDB';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    const code = parseInt(params.stop);
    const stop: Promise<stop[]> = pollStop(code);
    const data: Promise<stopDB> = getDB(code);
    return {
        code: code,
        api: stop,
        db: data
    };
}

// async function getStop(stop: number) {
//     const station = await fetch(`https://tools.gtt.cx/proxy/stop/${stop}`);
//     const data = await station.json();
//     return data as stop[];
// }

async function getDB(stop: number) {
    const station = await fetch(`https://tools.gtt.cx/proxy/stopDB/${stop}`);
    const data = await station.json();
    return data as stopDB;
}


/* GTT API */


//Fetch all info regarding departing vehicles from a stop (by number)
export async function pollStop(stop: number) {
    const url = `https://www.gtt.to.it/cms/index.php?option=com_gtt&task=palina.getTransitiOld&palina=${stop}&realtime=true`;
    const options = {
        method: 'GET',
        // mode: 'no-cors' as RequestMode
    };

    const response = await fetch(url, options);
    const stopsWeb: stopWeb[] = await response.json();

    const stops: stop[] = stopsWeb.map(pass => ({
        line: parseBusN(pass.LineaAlias),
        lineID: pass.Linea,
        direction: pass.Direzione,
        realTime: pass.PassaggiRT.map(hour => dateFromHourStr(hour)),
        programmed: pass.PassaggiPR.map(hour => dateFromHourStr(hour))
    }))

    return stops;
}

//Returns a date object from a string formatted as HH:mm
function dateFromHourStr(str: string) {
    const d = new Date();
    const i = str.indexOf(':')

    return new Date(d.getFullYear(), d.getMonth(), d.getDay(), parseInt(str.substring(0, i)) - 1, parseInt(str.substring(i + 1)));    //-1 to hours to correct timezone. I'll probably regret this
}

//Renames bus substituting trams, called "X navetta" to "XN", as shown on the bus themselves
function parseBusN(bus: string) {
    if (!bus.includes('navetta')) return bus;

    return bus.replace(' navetta', 'N');
}