import type { vehicle, vehicleWeb } from "$lib/vehicle";
import type { RequestHandler } from "@sveltejs/kit";
import { DateTime } from "luxon"

export const GET: RequestHandler = async ({ params }) => {
    return new Response(JSON.stringify(await pollRoute(params.route as string)));
}

async function pollRoute(route: string) {
    //Fetch GTFSRT endpoint
    //Array.filter only elements with ROUTE - TODO: send code in matching format, es: '10U'
    //No DB query should be necessary
        //Consider (test speed) when adding db query for each vehicle on route matching direction_id and trip_id on trips (or trips_full), it returns the headsign
            //Actually I don't even need to do that. It's either 1 or 0. I won't know what those numbers will mean but I can diferentiate between the two

    return null;
}

//Returns the full word "Bus" or "Tram"
function vehicleName(initial: string) {
    if (initial === 'B') return 'Bus';
    if (initial === 'T') return 'Tram';
    return initial;
}

//Converts a date string in the format "DD/MM/YYYY HH:mm" to a date object
function updatedDate(dateStr: string) {
    const res = DateTime.fromFormat(dateStr, 'D H:mm', { locale: 'it', zone: 'Europe/Rome' });

    return res.toJSDate();
}
