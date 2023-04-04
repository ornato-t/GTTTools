import type { stop, stopWeb, passage } from "$lib/stop";
import type { RequestHandler } from "@sveltejs/kit";
import { DateTime } from "luxon"

export const GET: RequestHandler = async ({ params }) => {
    return new Response(JSON.stringify(await pollStop(params.stop as string)));
}

//Fetch all info regarding departing vehicles from a stop (by number)
async function pollStop(stop: string) {
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

        return {
            route: parseBusN(pass.LineaAlias),
            routeID: pass.Linea,
            direction: pass.Direzione,
            pass: getPasses(pass.PassaggiPR, pass.PassaggiRT),
        }
    }) satisfies stop[];

    stops.sort((a: stop, b: stop) => {
        if (a.routeID < b.routeID) return -1;
        if (a.routeID < b.routeID) return 1;
        return 0;
    })

    return stops;
}

//Renames bus substituting trams, called "X navetta" to "XN", as shown on the bus themselves
function parseBusN(bus: string) {
    if (!bus.includes('navetta')) return bus;

    return bus.replace(' navetta', 'N');
}


const MAX_MINUTES = 5;  //Maximum difference to discriminate between a real time trip
const RETURNED_ENTRIES = 4; //Maximum number of timestamps to be returned
//Assemble an array of passes, either in real time or not, in an arrays of size RETURNED_ENTRIES
function getPasses(programmed: string[], realTime: string[]) {
    //If no real time passages are found return the programmed ones
    if (realTime.length === 0)
        return programmed.map(pass => { return { time: toDateTime(pass).toJSDate(), realTime: false } }).slice(0, RETURNED_ENTRIES) satisfies passage[];

    const rt = realTime.map(pass => toDateTime(pass));  //Cast to DateTime
    const res: passage[] = rt.map(pass => { return { time: pass.toJSDate(), realTime: true } });    //Create a returned object from real time

    //If the programmed ones aren't duplicates with the real time ones, add them, mark them as not real time
    for (const pass of programmed) {
        if (res.length >= RETURNED_ENTRIES) return res;

        const date = toDateTime(pass);  //Cast current programmed trip to DateTime
        let isDup = false;

        for (const passRt of rt) {
            const diff = passRt.diff(date, 'minutes').as('minutes');    //Calculate difference in minutes4
            
            if (Math.abs(diff) <= MAX_MINUTES) isDup = true;            //Difference absolute value
        };

        if (isDup) res.push({ time: date.toJSDate(), realTime: false });    //If the current programmed date is not a duplicate, push it
    }

    return res;


    function toDateTime(d: string) {
        return DateTime.fromFormat(d, 'H:m', { locale: 'it', zone: 'Europe/Rome' });
    }
}