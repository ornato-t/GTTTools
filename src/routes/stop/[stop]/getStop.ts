import type { stop } from '$lib/stop';
import fetch from '$lib/proxyRequest';

export default async function getStop(stop: number) {
    const station = await fetch(`/proxy/stop/${stop}`);

    if (station.status !== 200) {
        const err = await station.json();
        console.log(err); //In case of an error it will be detected here. However I can't use a custom loading page, otherwise the thing becomes super slow
        /*
            {
                "message": "GTT API offline",
                "status": 503
            }
        */
    }

    return station.json() as Promise<stop[]>;
}
