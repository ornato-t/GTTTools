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
  vehicleType?: string,
  lat: number,
  lon: number,
  updated: Date,
  // full: number
  // direction: number | null,
  // closest: string
};

export interface vehicleSearched extends vehicle {
  route: string,  //Route on which the vehicle is in service
}
