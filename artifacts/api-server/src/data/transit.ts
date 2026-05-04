export interface TransitLine {
  line: string;
  color: string;
}

export interface TransitStation {
  name: string;
  lines: TransitLine[];
  walkMinutes: number;
  note?: string;
}

export interface TransitInfo {
  stations: TransitStation[];
  busRoutes?: string[];
  parkingNote?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

const RED = "#EE352E";
const GREEN_DARK = "#00933C";
const GREEN_MED = "#6CBE45";
const BLUE = "#0039A6";
const ORANGE = "#FF6319";
const PURPLE = "#B933AD";
const BROWN = "#996633";
const GRAY = "#A7A9AC";
const YELLOW = "#FCCC0A";
const LIME = "#6CBE45";
const SILVER = "#808183";

const L = (line: string, color: string): TransitLine => ({ line, color });

export const TRANSIT_DATA: Record<string, TransitInfo> = {
  met: {
    stations: [
      { name: "86th St", lines: [L("4", GREEN_DARK), L("5", GREEN_DARK), L("6", GREEN_MED)], walkMinutes: 5 },
      { name: "77th St", lines: [L("6", GREEN_MED)], walkMinutes: 8 },
    ],
    busRoutes: ["M1", "M2", "M3", "M4", "M79"],
    parkingNote: "No museum parking. Street parking very limited. Garage on 84th St off Madison Ave.",
  },
  moma: {
    stations: [
      { name: "5th Ave/53rd St", lines: [L("E", BLUE), L("M", ORANGE)], walkMinutes: 2 },
      { name: "47–50 Sts/Rockefeller Ctr", lines: [L("B", ORANGE), L("D", ORANGE), L("F", ORANGE), L("M", ORANGE)], walkMinutes: 5 },
    ],
    busRoutes: ["M1", "M2", "M3", "M4", "M5", "M31", "M57"],
    parkingNote: "No museum parking. Many garages nearby on W 54th and W 56th St.",
  },
  amnh: {
    stations: [
      { name: "81st St–Museum of Natural History", lines: [L("B", ORANGE), L("C", BLUE)], walkMinutes: 1, note: "Station named for the museum" },
      { name: "79th St", lines: [L("1", RED)], walkMinutes: 5 },
    ],
    busRoutes: ["M7", "M10", "M11", "M79", "M86"],
    parkingNote: "Museum garage available on W 81st St between Central Park West & Columbus Ave.",
  },
  guggenheim: {
    stations: [
      { name: "86th St", lines: [L("4", GREEN_DARK), L("5", GREEN_DARK), L("6", GREEN_MED)], walkMinutes: 3 },
    ],
    busRoutes: ["M1", "M2", "M3", "M4", "M86"],
    parkingNote: "No museum parking. Street parking limited. Garage on 85th St.",
  },
  whitney: {
    stations: [
      { name: "14th St", lines: [L("A", BLUE), L("C", BLUE), L("E", BLUE)], walkMinutes: 4 },
      { name: "8th Ave", lines: [L("L", GRAY)], walkMinutes: 3 },
      { name: "14th St", lines: [L("F", ORANGE), L("M", ORANGE)], walkMinutes: 7 },
    ],
    busRoutes: ["M14A", "M14D", "M11"],
    parkingNote: "No museum parking. Garages available on Gansevoort and Little W 12th St.",
  },
  "brooklyn-museum": {
    stations: [
      { name: "Eastern Pkwy–Brooklyn Museum", lines: [L("2", RED), L("3", RED)], walkMinutes: 1, note: "Station directly at the museum" },
    ],
    busRoutes: ["B41", "B45", "B48", "B69"],
    parkingNote: "Free parking lot available on Eastern Pkwy adjacent to the museum.",
  },
  "9-11-memorial": {
    stations: [
      { name: "World Trade Center", lines: [L("E", BLUE)], walkMinutes: 2 },
      { name: "Park Place", lines: [L("2", RED), L("3", RED)], walkMinutes: 4 },
      { name: "Fulton St", lines: [L("A", BLUE), L("C", BLUE), L("J", BROWN), L("Z", BROWN), L("2", RED), L("3", RED), L("4", GREEN_DARK), L("5", GREEN_DARK)], walkMinutes: 5 },
      { name: "Cortlandt St", lines: [L("1", RED)], walkMinutes: 3 },
    ],
    busRoutes: ["M20", "M22"],
    parkingNote: "No museum parking. Several garages on Vesey, Fulton, and Church St.",
  },
  intrepid: {
    stations: [
      { name: "42nd St–Port Authority", lines: [L("A", BLUE), L("C", BLUE), L("E", BLUE)], walkMinutes: 10, note: "Walk west along 42nd St to 12th Ave" },
      { name: "Times Sq–42nd St", lines: [L("N", YELLOW), L("Q", YELLOW), L("R", YELLOW), L("W", YELLOW), L("S", SILVER), L("1", RED), L("2", RED), L("3", RED), L("7", PURPLE)], walkMinutes: 15 },
    ],
    busRoutes: ["M42", "M11"],
    parkingNote: "Parking available at Pier 86. Fee applies.",
  },
  frick: {
    stations: [
      { name: "68th St–Hunter College", lines: [L("6", GREEN_MED)], walkMinutes: 4 },
      { name: "Lexington Ave/63rd St", lines: [L("F", ORANGE), L("Q", YELLOW)], walkMinutes: 8 },
    ],
    busRoutes: ["M1", "M2", "M3", "M4", "M66", "M72"],
    parkingNote: "No museum parking. Garages on 68th and 70th St off Lexington Ave.",
  },
  "new-museum": {
    stations: [
      { name: "Bowery", lines: [L("J", BROWN), L("Z", BROWN)], walkMinutes: 2 },
      { name: "Spring St", lines: [L("6", GREEN_MED)], walkMinutes: 7 },
      { name: "Grand St", lines: [L("B", ORANGE), L("D", ORANGE)], walkMinutes: 8 },
    ],
    busRoutes: ["M15", "M103"],
    parkingNote: "Street parking on Bowery and nearby streets.",
  },
  mcny: {
    stations: [
      { name: "103rd St", lines: [L("6", GREEN_MED)], walkMinutes: 3 },
    ],
    busRoutes: ["M1", "M2", "M3", "M4", "M106"],
    parkingNote: "No museum parking. Street parking on 103rd St and Fifth Ave.",
  },
  "cooper-hewitt": {
    stations: [
      { name: "86th St", lines: [L("4", GREEN_DARK), L("5", GREEN_DARK), L("6", GREEN_MED)], walkMinutes: 5 },
    ],
    busRoutes: ["M1", "M2", "M3", "M4", "M86"],
    parkingNote: "No museum parking. Garages on 88th and 90th St.",
  },
  "jewish-museum": {
    stations: [
      { name: "86th St", lines: [L("4", GREEN_DARK), L("5", GREEN_DARK), L("6", GREEN_MED)], walkMinutes: 6 },
    ],
    busRoutes: ["M1", "M2", "M3", "M4", "M86"],
    parkingNote: "No museum parking. Street parking limited.",
  },
  "rubin-museum": {
    stations: [
      { name: "18th St", lines: [L("1", RED)], walkMinutes: 3 },
      { name: "14th St/8th Ave", lines: [L("A", BLUE), L("C", BLUE), L("E", BLUE), L("L", GRAY)], walkMinutes: 5 },
      { name: "14th St", lines: [L("F", ORANGE), L("M", ORANGE)], walkMinutes: 6 },
    ],
    busRoutes: ["M11", "M14A", "M23"],
    parkingNote: "No museum parking. Garages on 17th and 18th St.",
  },
  "studio-museum-harlem": {
    stations: [
      { name: "125th St", lines: [L("A", BLUE), L("B", ORANGE), L("C", BLUE), L("D", ORANGE)], walkMinutes: 4, note: "Temporary pop-up location — check website" },
      { name: "125th St", lines: [L("2", RED), L("3", RED)], walkMinutes: 6 },
    ],
    busRoutes: ["M10", "M60", "M100", "M101"],
    parkingNote: "Street parking on 127th St and Adam Clayton Powell Blvd.",
  },
  "el-museo-del-barrio": {
    stations: [
      { name: "103rd St", lines: [L("6", GREEN_MED)], walkMinutes: 3 },
    ],
    busRoutes: ["M1", "M2", "M3", "M4", "M106"],
    parkingNote: "Street parking on Fifth Ave and 103rd–104th St.",
  },
  "museum-arts-design": {
    stations: [
      { name: "59th St–Columbus Circle", lines: [L("A", BLUE), L("B", ORANGE), L("C", BLUE), L("D", ORANGE), L("1", RED)], walkMinutes: 1, note: "Connected to the Time Warner Center complex" },
    ],
    busRoutes: ["M7", "M10", "M31", "M57", "M104"],
    parkingNote: "Parking in Time Warner Center garage. Discounted validation not available.",
  },
  "bronx-museum": {
    stations: [
      { name: "167th St", lines: [L("4", GREEN_DARK)], walkMinutes: 5 },
      { name: "170th St", lines: [L("4", GREEN_DARK)], walkMinutes: 4 },
    ],
    busRoutes: ["Bx1", "Bx2", "Bx35"],
    parkingNote: "Street parking available on Grand Concourse.",
  },
  "queens-museum": {
    stations: [
      { name: "Mets–Willets Point", lines: [L("7", PURPLE)], walkMinutes: 10, note: "Walk through Flushing Meadows Corona Park" },
    ],
    busRoutes: ["Q23", "Q48", "Q58"],
    parkingNote: "Free parking available in Flushing Meadows Corona Park lot.",
  },
  "moma-ps1": {
    stations: [
      { name: "Court Sq–23rd St", lines: [L("E", BLUE), L("M", ORANGE)], walkMinutes: 5 },
      { name: "Court Sq", lines: [L("G", LIME), L("7", PURPLE)], walkMinutes: 5 },
      { name: "45th Rd–Court House Sq", lines: [L("7", PURPLE)], walkMinutes: 6 },
    ],
    busRoutes: ["Q32", "Q60", "Q101", "Q102", "Q103"],
    parkingNote: "Street parking on Jackson Ave and 46th Ave.",
  },
  "ny-transit-museum": {
    stations: [
      { name: "Borough Hall", lines: [L("2", RED), L("3", RED), L("4", GREEN_DARK), L("5", GREEN_DARK)], walkMinutes: 2 },
      { name: "Jay St–MetroTech", lines: [L("A", BLUE), L("C", BLUE), L("F", ORANGE), L("R", YELLOW)], walkMinutes: 3 },
    ],
    busRoutes: ["B25", "B26", "B37", "B38", "B41", "B45", "B52"],
    parkingNote: "Paid parking garages on Joralemon and Court St.",
  },
  "brooklyn-children": {
    stations: [
      { name: "Kingston Ave", lines: [L("3", RED)], walkMinutes: 5 },
      { name: "Kingston–Throop Avs", lines: [L("C", BLUE)], walkMinutes: 7 },
    ],
    busRoutes: ["B43", "B44", "B45", "B65"],
    parkingNote: "Street parking on Brooklyn and St. Marks Avs.",
  },
  "staten-island-museum": {
    stations: [
      { name: "St. George Terminal (SIR)", lines: [L("SIR", BLUE)], walkMinutes: 5, note: "Take Staten Island Ferry from Whitehall St/South Ferry, then SIR train" },
    ],
    busRoutes: ["S40", "S44", "S61", "S62", "S74"],
    parkingNote: "Parking available near St. George Terminal.",
  },
  "ny-historical-society": {
    stations: [
      { name: "81st St–Museum of Natural History", lines: [L("B", ORANGE), L("C", BLUE)], walkMinutes: 4 },
      { name: "79th St", lines: [L("1", RED)], walkMinutes: 3 },
    ],
    busRoutes: ["M7", "M10", "M11", "M72", "M79"],
    parkingNote: "No museum parking. Garages on W 76th and W 81st St.",
  },
  "childrens-museum-manhattan": {
    stations: [
      { name: "86th St", lines: [L("1", RED)], walkMinutes: 4 },
      { name: "86th St", lines: [L("B", ORANGE), L("C", BLUE)], walkMinutes: 6 },
    ],
    busRoutes: ["M7", "M10", "M11", "M79", "M86"],
    parkingNote: "No museum parking. Garages on W 81st and W 84th St.",
  },
  "hayden-planetarium": {
    stations: [
      { name: "81st St–Museum of Natural History", lines: [L("B", ORANGE), L("C", BLUE)], walkMinutes: 1, note: "Shared entrance with AMNH" },
      { name: "79th St", lines: [L("1", RED)], walkMinutes: 5 },
    ],
    busRoutes: ["M7", "M10", "M11", "M79", "M86"],
    parkingNote: "Museum garage available on W 81st St.",
  },
};

export const COORDINATES: Record<string, Coordinates> = {
  met: { lat: 40.7794, lng: -73.9632 },
  moma: { lat: 40.7614, lng: -73.9776 },
  amnh: { lat: 40.7813, lng: -73.9740 },
  guggenheim: { lat: 40.7830, lng: -73.9590 },
  whitney: { lat: 40.7396, lng: -74.0089 },
  "brooklyn-museum": { lat: 40.6712, lng: -73.9636 },
  "9-11-memorial": { lat: 40.7115, lng: -74.0132 },
  intrepid: { lat: 40.7645, lng: -74.0026 },
  frick: { lat: 40.7713, lng: -73.9672 },
  "new-museum": { lat: 40.7224, lng: -73.9930 },
  mcny: { lat: 40.7923, lng: -73.9519 },
  "cooper-hewitt": { lat: 40.7849, lng: -73.9594 },
  "jewish-museum": { lat: 40.7846, lng: -73.9586 },
  "rubin-museum": { lat: 40.7424, lng: -74.0000 },
  "studio-museum-harlem": { lat: 40.8094, lng: -73.9516 },
  "el-museo-del-barrio": { lat: 40.7921, lng: -73.9521 },
  "museum-arts-design": { lat: 40.7684, lng: -73.9826 },
  "bronx-museum": { lat: 40.8384, lng: -73.9211 },
  "queens-museum": { lat: 40.7461, lng: -73.8473 },
  "moma-ps1": { lat: 40.7449, lng: -73.9462 },
  "ny-transit-museum": { lat: 40.6909, lng: -73.9895 },
  "brooklyn-children": { lat: 40.6700, lng: -73.9407 },
  "staten-island-museum": { lat: 40.6433, lng: -74.0736 },
  "ny-historical-society": { lat: 40.7793, lng: -73.9737 },
  "childrens-museum-manhattan": { lat: 40.7848, lng: -73.9810 },
  "hayden-planetarium": { lat: 40.7813, lng: -73.9740 },
};
