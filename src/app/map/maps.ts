export interface MapMarkerOptions {
  lat: number;
  lng: number;
  title?: string;
}

export interface GoogleMapsConfig {
  /** Your google maps key */
  key?: string;
  /** Your google maps client ID */
  clientId?: string;
  /** The libraries you want to load `places,drawing,geometry` */
  libraries?: string;
}
