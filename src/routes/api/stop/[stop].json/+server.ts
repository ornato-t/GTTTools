import type { stop, stopWeb } from "$lib/stop";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
    return new Response(JSON.stringify(await pollStop(params.stop as string)));
}

//Fetch all info regarding departing vehicles from a stop (by number)
export async function pollStop(stop: string) {
    const url = `https://www.gtt.to.it/cms/index.php?option=com_gtt&task=palina.getTransitiOld&palina=${stop}&realtime=true&get_param=value`;
    const options = {
        method: 'GET'
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
    const dateStr = d.toISOString();
    const ISOStr = `${dateStr.substring(0, dateStr.indexOf('T'))}T${str}`;
    return new Date(ISOStr);
}

//Renames bus substituting trams, called "X navetta" to "XN", as shown on the bus themselves
function parseBusN(bus: string) {
    if (!bus.includes('navetta')) return bus;

    return bus.replace(' navetta', 'N');
}