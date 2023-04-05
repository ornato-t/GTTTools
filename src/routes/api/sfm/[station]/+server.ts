import type { vt_train, solutions, trip, station, platform, train } from "$lib/train";
import { getByCode, getByName } from "$lib/trainStations";
import { error, type RequestHandler } from "@sveltejs/kit";
import { DateTime } from "luxon";

const RETURNED_ENTRIES = 4; //Maximum number of timestamps to be returned

export const GET: RequestHandler = async ({ params }) => {
    const station = params.station || '';
    const { code_vt, code_fr, name } = getByCode(Number.parseInt(station)) ?? { code_vt: null, code_fr: null };

    if (code_vt == null || code_fr == null) throw error(404, 'Undefined stop code');

    const [stationInfo, toPN, toLing, toStu] = await Promise.all([pollStation(code_vt), linkStations(code_fr, 'porta nuova'), linkStations(code_fr, 'lingotto'), linkStations(code_fr, 'stura')]);

    return new Response(JSON.stringify({
        name,
        departures: {
            portaNuova: pair(stationInfo, toPN),
            lingotto: pair(stationInfo, toLing),
            stura: pair(stationInfo, toStu),
        }
    }));
}

async function pollStation(station: string) {
    const date = DateTime.now().setLocale('en-GB').toFormat('ccc DD TT');
    const url = `http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/partenze/${station}/${date}`;

    try {
        const res = await fetch(url);
        const json = await res.json() as vt_train[];

        const out = json.map(train => {
            let platform: platform;

            if (train.binarioEffettivoPartenzaDescrizione !== null) {
                platform = {
                    id: train.binarioEffettivoPartenzaDescrizione,
                    confirmed: true,
                }
            } else {
                platform = {
                    id: train.binarioProgrammatoPartenzaDescrizione,
                    confirmed: false,
                }
            }

            return {
                id: train.numeroTreno,
                category: train.categoriaDescrizione,
                destination: train.destinazione,
                delay: train.ritardo,
                platform: platform,
            } satisfies station;
        });

        return out;
    } catch (e) {
        console.log(e);
        return [];
    }
}

//TODO: find better way to get the stop name. I need to be able to detect station === dest and return an empty array
async function linkStations(station: number, dest: string) {
    const destination = getByName(dest)?.code_fr;

    const date = DateTime.now().setZone('Europe/Rome').toString();
    const url = `https://www.lefrecce.it/Channels.Website.BFF.WEB/website/ticket/solutions`;
    const parameters = {
        "departureLocationId": station,
        "arrivalLocationId": destination,
        "departureTime": date,
        "adults": 1,
        "children": 0,
        "criteria": {
            "frecceOnly": false,
            "regionalOnly": true,
            "noChanges": false,
            "order": "DEPARTURE_DATE",
            "limit": 10,
            "offset": 0
        },
        "advancedSearchRequest": {
            "bestFare": false
        }
    }
    try {
        const res = await fetch(
            url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(parameters),
            method: 'POST'
        });

        const json = await res.json() as solutions;
        const out = json.solutions.map(sol => {
            return {
                id: Number.parseInt(sol.solution.trains[0].name),
                name: sol.solution.trains[0].logoId,
                category: sol.solution.trains[0].trainCategory,
                destination: cleanName(sol.solution.destination),
                origin: cleanName(sol.solution.origin),
                departure: sol.solution.departureTime,
            } satisfies trip;
        });

        return out;
    } catch (e) {
        console.log(e);
        return [];
    }

    function cleanName(str: string) {
        const regex = /Torino ([\w ]+)/;
        const match = str.match(regex);
        if (match === null) return str;
        return match[1];
    }
}

function pair(stationInfo: station[], trains: trip[]) {
    const out = trains.map(pass => {
        const match = stationInfo.find(tr => tr.id === pass.id) ?? null;

        if (match === null) return pass;

        return {
            id: pass.id,
            name: pass.name,
            category: pass.category,
            destination: pass.destination,
            origin: pass.origin,
            departure: DateTime.fromISO(pass.departure.toString()).plus({ minutes: match.delay }).toJSDate(),   //Any delay is already factored in
            platform: {
                id: match.platform.id,
                confirmed: match.platform.confirmed
            } satisfies platform,
        } satisfies train;
    });

    const blacklisted = [''];   //TODO: add IC and FR
    return out.filter(train => !blacklisted.includes(train.category)).slice(0, RETURNED_ENTRIES);
}