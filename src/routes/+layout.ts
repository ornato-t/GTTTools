import type { LayoutLoad } from "./$types";
import type { strike, strikeNotif } from "$lib/strikes";
import fetch from '$lib/proxyRequest';
import { DateTime } from "luxon";

const DAYS = 7;

export const load = (async () => {
    return {
        strike: {
            promise: pollStrikes()
        }
    };
}) satisfies LayoutLoad;

async function pollStrikes() {
    try {
        const res = await fetch('/api/strikes');
        const json = await res.json() as strike[];

        //Only return strikes that impact Turin (or the whole region), are in the future or today and aren't "general strikes"
        const filtered = json.filter(strike => {
            if (strike.province !== 'Tutte' && strike.province !== 'Torino') return false;

            const strikeD = DateTime.fromISO(strike.dateEnd.toString());
            const dateDiff = strikeD.diffNow("days").as('days');

            if (dateDiff >= DAYS || dateDiff <= -1) return false;
            if (strike.sector === 'Generale') return false;
            return true;
        }).map(strike => {
            return {
                date: new Date(strike.dateEnd),
                sector: strike.sector,
            } satisfies strikeNotif;
        });

        return filtered;
    } catch (e) {
        console.log(e);
        return null;
    }
}