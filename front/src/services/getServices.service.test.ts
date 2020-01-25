import { httpClient } from "../helpers";
import { GetServicesServices } from "./getServices.service"

const get = jest.spyOn(httpClient, "get");

const queryTestGroom = {
  lat: 48.864716,
  lon: 2.349014,
  radius: 1000,
  placeType: "groom"
}

const queryTestFail = {
  lat: 48.864716,
  lon: 2.349014,
  radius: 1000,
  placeType: "jedi temple"
}

const markerDataTestGroom = [
  {
    key: "4d566932cff7721ebc47b5f5",
    info: "Clinique Vétérinaire du Dr Frantz Cappé, 14 Rue Bertin Poirée",
    position: [
      48.8587974959729,
      2.344810779424984
    ],
    serviceType: "groom"
  },
  {
    key: "5336fb91498e0f1c0951aeba",
    info: "ARISTIDE - Hôtel pour félins urbains, 11 rue Ambroise Thomas",
    position: [
      48.874755701038886,
      2.3474008276383893
    ],
    serviceType: "groom"
  },
  {
    key: "59e23363ea1e4418efee790c",
    info: "Chat!",
    position: [
      48.857427,
      2.354303
    ],
    serviceType: "groom"
  }
]

// We generate the answer of the back from what we actually expect…
const backMarkers = markerDataTestGroom.map(marker => {
    const addressSeparator = marker.info.lastIndexOf(',');
    return {
        id: marker.key,
        name: addressSeparator == - 1 ? marker.info : marker.info.substring(0, addressSeparator),
        location: {
            address: addressSeparator == - 1 ? '' : marker.info.substring(addressSeparator + 2),
            lat: marker.position[0],
            lng: marker.position[1]
        }
    }
});

beforeEach(() => {
	jest.resetAllMocks();
});


test('Get grooms', async () => {
  get.mockResolvedValue({response: {venues: backMarkers}});
  await GetServicesServices.get(queryTestGroom.lat, queryTestGroom.lon, queryTestGroom.radius, queryTestGroom.placeType).then(g => {
    expect(g).toStrictEqual(markerDataTestGroom);
  });
});


test('Wrong query', async () => {
  get.mockRejectedValue('Aucun services trouvés');
  await GetServicesServices.get(queryTestFail.lat, queryTestFail.lon, queryTestFail.radius, queryTestFail.placeType).catch(e => expect(e).toBeDefined());
  expect.assertions(1);
});
