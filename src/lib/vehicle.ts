//Represents a vehicle: either a bus or a tram. As provided by the GTT site
export interface vehicleWeb {
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
export interface vehicle {
    id: number,
    vehicleType: string,
    lat: number,
    lon: number,
    direction: number,
    updated: Date,
  };
  