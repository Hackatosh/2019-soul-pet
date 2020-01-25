interface SServicesMapType{
  userPosition: Array<number>;
  toDisplay: Array<string>;
  radius: number;
  markers: Array<MarkerDataType>;
}

interface QueryServiceType{
  lat: number,
  long: number,
  radius: number,
  placeType: string
}

interface PServicesMapType{
  lat: number;
  lon: number;
  zoom: number;
  size: string;
}

interface MarkerDataType{
  key:string;
  position: Array<number>;
  info: string;
  serviceType: string;
}

export type SServicesMap = SServicesMapType
export type PServicesMap = PServicesMapType
export type MarkerData = MarkerDataType
export type ListMarkerData = Array<MarkerDataType>
export type QueryService = QueryServiceType
