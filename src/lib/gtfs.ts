export function getVehicleType(type: number) {
    switch (type) {
        case 0: return "Tram";
        case 1: return "Metro";
        case 2: return "Treno";
        case 3: return "Bus";
        case 4: return "Traghetto";
        case 5: return "Tram";
        case 6: return "Ovovia";
        case 7: return "Cremagliera";
        case 11: return "Filobus";
        case 12: return "Monorotaia";
    }
    return "";
}
