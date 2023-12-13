import type { LayoutServerLoad } from "./$types";
import type { strikeNotif } from "$lib/strikes";
import { DateTime } from "luxon";
import { poll } from "$lib/poll/strikes";

const DAYS = 7;

export const load = (async () => {
    return {
        strike: {
            promise: pollStrikes()
        }
    };
}) satisfies LayoutServerLoad;

async function pollStrikes() {
    try {
        const raw = await poll();

        //Only return strikes that impact Turin (or the whole region), are in the future or today and aren't "general strikes"
        const filtered = raw.filter(strike => {
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
                scope: strike.scope,
            } satisfies strikeNotif;
        });

        return filtered;
    } catch (e) {
        console.log(e);
        return null;
    }
}