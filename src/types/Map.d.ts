type Maps = typeof google.maps | null;

interface Marker {
    coordinate: Coordinate;
    id: number;
}

interface Coordinate {
  lat: number;
  lng: number
}