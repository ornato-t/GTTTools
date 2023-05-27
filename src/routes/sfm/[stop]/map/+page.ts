import type { LatLngExpression } from "leaflet";

export async function load({ data, depends, parent }) {
    depends('stop_lines');
    
    const parentData = await parent();

    const coords = [parentData.db.coordinates[1], parentData.db.coordinates[0]] as LatLngExpression;    //Need to swap coords, mongo wants [lon, lat]; leaflet wants [lat, lon]

    return {
        coords,
        near: data.near
    };
}
