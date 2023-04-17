<script lang="ts">
    import type {PageData} from "./$types";

    export let data: PageData;

    const coords = [data.db.coordinates[1], data.db.coordinates[0]];    //Need to swap coords, mongo wants [lon, lat]; leaflet wants [lat, lon]
</script>
La fermata {data.db.name} si trova qui: {coords[0]},{coords[1]}