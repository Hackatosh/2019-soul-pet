interface Position{
  lat: number;
  lon: number;
}

interface SServicesMapType{
  notice: string;
  userPosition: Position;
  toDisplay: Array<string>;
  radius: number;
  markers: Array<MarkerDataType>;
  isQuerying: boolean;
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
