import { httpClient, history } from "../helpers";
import { ListMarkerData, MarkerData } from "../models";
import { GetServicesServices } from "./getServices.service"

const get = jest.spyOn(httpClient, "get");
const getServices = jest.spyOn(GetServicesServices, "get");


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


beforeEach(() => {
	jest.resetAllMocks();
});


test('Get grooms', async () => {
  get.mockResolvedValue(markerDataTestGroom);
  await GetServicesServices.get(queryTestGroom).then(g => {
    expect(g).toStrictEqual(markerDataTestGroom);
  });
});


test('Wrong query', async () => {
  get.mockRejectedValue('Aucun services trouvés');
  await GetServicesServices.get(queryTestFail).catch(e => expect(e).toBeDefined());
  expect.assertions(1);
});
