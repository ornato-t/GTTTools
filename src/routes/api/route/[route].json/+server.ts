//Represents a vehicle: either a bus or a tram. As provided by the GTT site
interface vehicleWeb {
    id: number,
    tipo: string,
    disabili: boolean,
    lat: number,
    lon: number,
    direzione: number,
    aggiornamento: string,
    occupazione: number
};

//Represents a vehicle: either a bus or a tram. Prettified for use in app
interface vehicle {
    id: number,
    vehicleType: string,
    lat: number,
    lon: number,
    direction: number,
    updated: Date,
};

export async function GET(req: any) {
    const route = req.params.route as string;
    return new Response(JSON.stringify(await pollRoute(route)));
}

async function pollRoute(route: string) {
    const url = `https://www.gtt.to.it/cms/components/com_gtt/views/percorsi/tmpl/proxydaslinea.php?serviceName=GetVeicoliPerLineaJson&linea=${route}`;
    const options = {
      method: 'GET',
      headers: {
        Referer: `https://www.gtt.to.it/cms/percorari/urbano?view=percorsi&bacino=U&linea=${route}&Regol=GE`
      }
    };
    
      const response = await fetch(url, options);
      const vehiclesWeb:vehicleWeb[] = await response.json();
  
      const vehicles: vehicle[] = vehiclesWeb.map(vehicle => ({
        id: vehicle.id,
        vehicleType: vehicleName(vehicle.tipo),
        lat: vehicle.lat,
        lon: vehicle.lon,
        direction: vehicle.direzione,
        updated: updatedDate(vehicle.aggiornamento)
      }))
      return vehicles;
  }

// //Returns the full word "Bus" or "Tram"
function vehicleName(initial: string) {
    if (initial === 'B') return 'Bus';
    if (initial === 'T') return 'Tram';
    return initial;
}

// //Converts a date string in the format "DD/MM/YYYY HH:mm" to a date object
function updatedDate(dateStr: string) {
    dateStr = dateStr.replace(' ', '-');
    dateStr = dateStr.replace(':', '-');
    dateStr = dateStr.replaceAll('/', '-');
    const dateFields = dateStr.split('-');
    const dateStrReconstructed = `${dateFields[2]}-${dateFields[1]}-${dateFields[0]}T${dateFields[3]}:${dateFields[4]}`;
    return new Date(dateStrReconstructed);
}