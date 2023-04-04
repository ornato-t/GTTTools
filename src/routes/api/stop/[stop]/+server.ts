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

    stops.sort((a, b) => {
        if (a.routeID < b.routeID) return -1;
        if (a.routeID > b.routeID) return 1;
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
const PAST_THRESHOLD = 2;
//Assemble an array of passes, either in real time or not, in an arrays of size RETURNED_ENTRIES
function getPasses(programmed: string[], realTime: string[]) {

    //If no real time passages are found return the programmed ones
    if (realTime.length === 0)
        return programmed
            .map(pass => toDateTime(pass))  //Cast to DateTime
            .filter(pass => isFuture(pass, PAST_THRESHOLD)) //Filter out ones in the past
            .map(pass => { return { time: pass.toJSDate(), realTime: false } }) //Map to object
            .slice(0, RETURNED_ENTRIES) satisfies passage[];    //Only take the first N

    const rt = realTime.map(pass => toDateTime(pass))  //Cast to DateTime

    //Create returned object from real time in the future
    const res: passage[] = rt
        .filter(pass => isFuture(pass, PAST_THRESHOLD))
        .map(pass => { return { time: pass.toJSDate(), realTime: true } })
        .slice(0, RETURNED_ENTRIES);   

    //If the programmed ones aren't duplicates of the real time ones, add them, mark them as not real time
    for (const pass of programmed) {
        if (res.length >= RETURNED_ENTRIES) {
            return res.sort((a, b) => {
                if (a.time < b.time) return -1;
                if (a.time > b.time) return 1;
                return 0;
            });
        }

        const date = toDateTime(pass);  //Cast current programmed trip to DateTime
        let isDup = false;

        for (const passRt of rt) {
            const diff = passRt.diff(date, 'minutes').as('minutes');    //Calculate difference in minutes4

            if (Math.abs(diff) <= MAX_MINUTES) {
                isDup = true;
                break;
            }
        };

        //If the current programmed date is not a duplicate, push it (only if it isn't in the future)
        if (!isDup && isFuture(date, PAST_THRESHOLD))
            res.push({ time: date.toJSDate(), realTime: false });

    }

    return res.sort((a, b) => {
        if (a.time < b.time) return -1;
        if (a.time > b.time) return 1;
        return 0;
    });


    //Cast a string date to DateTime
    function toDateTime(d: string) {
        return DateTime.fromFormat(d, 'H:m', { locale: 'it', zone: 'Europe/Rome' });
    }

    //Returns true if a DateTime is in the future or in the past within a certain tolerance [minutes]
    function isFuture(d: DateTime, tolerance: number) {
        const difference = d.diffNow('minutes').as('minutes');

        if (difference > (tolerance * -1)) return true;
        return false;
    }
}