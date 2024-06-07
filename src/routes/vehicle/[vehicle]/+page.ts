import { getVehicleType } from '$lib/gtfs.js';

export async function load({ data }) {
    const { type, ...dataNoType } = data;

    return {
        ...dataNoType,
        type: getVehicleType(type),     //Convert numeric GTFS vehicle ID to string
    };
}