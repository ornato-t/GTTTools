import type { stop, stopWeb } from "$lib/stop";
import type { RequestHandler } from "@sveltejs/kit";
import { DateTime } from "luxon"

export const GET: RequestHandler = async ({ params }) => {
    return new Response(JSON.stringify(await pollStop(params.stop as string)));
}

//Fetch all info regarding departing vehicles from a stop (by number)
export async function pollStop(stop: string) {
    const url = `https://www.gtt.to.it/cms/index.php?option=com_gtt&task=palina.getTransitiOld&palina=${stop}&realtime=true`;
    const options = {
        method: 'GET',
        mode: 'no-cors' as RequestMode
    };

    const response = await fetch(url, options);
    if (response.status !== 200) throw new Error();

    const stopsWeb: stopWeb[] = await response.json();

    const stops = stopsWeb.map(pass => {
        if (pass.Linea === undefined) throw new Error('Undefined stop name');

        if (pass.Linea === 'METRO' || pass.Bacino === 'E' || pass.PassaggiRT.length === 0)  // METRO and "Bus Extraurbani" don't have real time passages. If no real time passages are available return the programmed one
            return {
                route: parseBusN(pass.LineaAlias),
                routeID: pass.Linea,
                direction: pass.Direzione,
                pass: pass.PassaggiPR.map(hour => dateFromHourStr(hour)),
                realTime: false
            }
        else
            return {
                route: parseBusN(pass.LineaAlias),
                routeID: pass.Linea,
                direction: pass.Direzione,
                pass: pass.PassaggiRT.map(hour => dateFromHourStr(hour)),
                realTime: true
            }
    }) satisfies stop[];

    stops.sort((a: stop, b: stop) => {
        if (a.routeID < b.routeID) return -1;
        if (a.routeID < b.routeID) return 1;
        return 0;
    })

    return stops;
}

//Returns a date object from a string formatted as HH:mm
function dateFromHourStr(str: string) {
    // const res = moment.tz(str, "Europe/Rome");
    // const res = moment(str, ['h:m a', 'H:m']);
    const res = DateTime.fromFormat(str, 'H:m').setZone("Europe/Rome");
    const out = res.toJSDate();

    console.log(str, out)

    return out;
}

//Renames bus substituting trams, called "X navetta" to "XN", as shown on the bus themselves
function parseBusN(bus: string) {
    if (!bus.includes('navetta')) return bus;

    return bus.replace(' navetta', 'N');
}