const RETURNED_ENTRIES = 4; //Maximum number of timestamps to be returned

export async function pollStop(stop: number): Promise<stop[]> {
    const query = `
        query ConsolidatedQuery($id: String!, $startTime: Long!, $timeRange: Int!, $numberOfDepartures: Int!) {
            stop(id: $id) {
                ... on Stop {
                    stops: stoptimesWithoutPatterns(
                        startTime: $startTime
                        timeRange: $timeRange
                        numberOfDepartures: $numberOfDepartures
                        omitCanceled: true
                    ) {
                        serviceDay
                        realtimeDeparture
                        realtime
                        trip {
                            tripHeadsign
                            wheelchairAccessible
                            occupancyStatus
                            pattern {
                                route {
                                    shortName
                                }
                            }
                        }
                    }
                }
            }
        }  
    `;
    const variables = {
        id: `gtt:${stop}`,
        startTime: `${Math.round(new Date().valueOf() / 1000)}`,
        timeRange: 3600000,
        numberOfDepartures: 100
    };

    const response = await fetch('https://plan.muoversiatorino.it/otp/routers/mato/index/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify({ query, variables }),
    });

    const api = await response.json() as GraphQL;
    if (!api.data.stop) throw new Error('noInfo');  //Stop not found

    const clean = new Array<stop>();
    for (const stop of api.data.stop.stops) {
        const index = clean.findIndex(s => s.route === stop.trip.pattern.route.shortName);

        if (index === -1) { //Stop hasn't been added yet
            clean.push({
                route: stop.trip.pattern.route.shortName,
                direction: stop.trip.tripHeadsign,
                pass: [{
                    time: new Date((stop.serviceDay + stop.realtimeDeparture) * 1000),
                    realTime: stop.realtime,
                    full: stop.trip.occupancyStatus === 'FULL' || stop.trip.occupancyStatus === 'NOT_ACCEPTING_PASSENGERS',
                    wheelchair: stop.trip.wheelchairAccessible === 'POSSIBLE'
                }],
            });
        } else if (clean[index].pass.length < RETURNED_ENTRIES) {   //Add to already existing stop, at most RETURNED_ENTRIES
            const passes = clean[index].pass.length;
            const currentPass = new Date((stop.serviceDay + stop.realtimeDeparture) * 1000);

            if (passes > 0) {
                const diff = currentPass.valueOf() - clean[index].pass[passes - 1].time.valueOf();  //Difference between the date of this pass and the previous one - sometimes there are duplicates
                if (diff <= 30 * 1000) {
                    continue;   //Skip iteration in case of duplicates
                }
            }

            clean[index].pass.push({
                time: currentPass,
                realTime: stop.realtime,
                full: stop.trip.occupancyStatus === 'FULL' || stop.trip.occupancyStatus === 'NOT_ACCEPTING_PASSENGERS',
                wheelchair: stop.trip.wheelchairAccessible === 'POSSIBLE'
            });
        }
    }

    //Sort by route number
    clean.sort((a, b) => {
        if (a.route < b.route) return -1;
        if (a.route > b.route) return 1;
        return 0;
    });

    return clean;
}

//Represents the data about a stop. As provided by the MATO GraphQL API
interface GraphQL {
    data: {
        stop: {
            stops: {
                serviceDay: number
                realtimeDeparture: number
                realtime: boolean
                trip: {
                    tripHeadsign: string
                    wheelchairAccessible: 'NO_INFORMATION' | 'POSSIBLE' | 'NOT_POSSIBLE'
                    occupancyStatus: 'EMPTY' | 'MANY_SEATS_AVAILABLE' | 'FEW_SEATS_AVAILABLE' | 'STANDING_ROOM_ONLY' | 'CRUSHED_STANDING_ROOM_ONLY' | 'FULL' | 'NOT_ACCEPTING_PASSENGERS'
                    pattern: { route: { shortName: string } }
                }
            }[]
        } | null;
    }
}

//Represents a vehicle stopping by a stop. Prettified for use in app
export interface stop {
    route: string;
    // routeID: string;
    direction: string;
    pass: {
        time: Date;
        realTime: boolean;
        full: boolean;
        wheelchair: boolean;
    }[];
}
