import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import fetchMock from "fetch-mock";
import apiResponse, { mediaResponse } from "./__mocks__/apiResponse.js";
import Station from "../src/models/Station";
import * as actions from "../src/redux/actions/stationActions";

const mockStore = configureMockStore([thunk]);
let store = mockStore({ main: { stations: [] } });

// describe("MOCKS", () => {
//   actions.f1 = jest.fn();
//   expect(actions.f1).toBeCalled();
//   actions.calls_f1();
// });

describe("async fetching actions", () => {
  // #region SET UP VARIABLES AND MOCKS
  const firstStationJSON = apiResponse[0];
  const firstStationObject = Station.createFromApiResponse(firstStationJSON);
  const mainApiUrl = "http://joinelectro.com/wp-json/wp/v2/job-listings/";
  const mediaDataURL = "http://joinelectro.com/wp-json/wp/v2/media/817";
  const imageURL =
    "http://joinelectro.com/wp-content/uploads/2019/04/Charging-port-300x225.jpg";
  beforeEach(() => {
    fetchMock.mock(mainApiUrl, apiResponse);
    fetchMock.mock(mediaDataURL, mediaResponse);
  });

  afterEach(() => {
    store = mockStore({ main: { stations: [] } });
    fetchMock.restore();
  });

  // consoleSpy = jest.spyOn(console, "log").mockImplementation();

  // #endregion

  describe("_getImageURLForStation (private method)", () => {
    it("returns an action with the updated station", async () => {
      const returnedAction = await actions._getImageURLForStation(
        firstStationObject
      );
      expect(returnedAction.type).toEqual("UPDATE_STATION");
      expect(returnedAction.station.imageURL).toEqual(imageURL);
    });
  });

  describe("getImageURLForStation (public method)", () => {
    xit("dispatches an updated station", async () => {
      const expectedUpdateAction = {
        type: "UPDATE_STATION",
        station: { ...firstStationObject, imageURL }
      };
      await store.dispatch(actions.getImageURLForStation(firstStationObject));
      expect(store.getActions()).toEqual([expectedUpdateAction]);
    });
  });

  describe("fetchStations(shouldDownload)", () => {
    // #region SET UP
    const downloadedResponse = {
      [firstStationJSON.id]: Station.createFromApiResponse(firstStationJSON)
    };
    const expectedGetActions = [
      { type: "GET_STATIONS_START" },
      { type: "GET_STATIONS_SUCCESS", stations: downloadedResponse }
    ];
    const expectedUpdateAction = {
      type: "UPDATE_STATION",
      station: { ...firstStationObject, imageURL }
    };

    beforeEach(async () => {
      await store.dispatch(actions.fetchStations({ shouldDownload: true }));
    });
    afterEach(() => {
      console.log(store.getActions().map(a => a.type));
    });
    // #endregion

    xit("calls _getImageURLsForAllStations", () => {
      actions._getImageURLsForAllStations = jest.fn();
      expect(actions._getImageURLsForAllStations).toBeCalled();
    });

    it("gets stations from the website and dispatches them to the store", () => {
      expect(store.getActions()).toEqual(
        expect.arrayContaining(expectedGetActions)
      );
    });

    it("updates the stations' imageURL via dispatch", () => {
      const types = store.getActions().map(a => a.type);
      expect(types).toEqual(expect.arrayContaining(["UPDATE_STATION"]));
    });

    xit("dispatches the update actions AFTER the get actions", () => {
      const storeActions = store.getActions();
      expect(storeActions.indexOf(expectedGetActions[0])).toBeLessThan(
        storeActions.indexOf(expectedUpdateAction)
      );
    });
  });

  describe("fetchStations(useCache)", () => {
    /* it("gets stations from the local storage and dispatches them to the store", () => {
      const cachedResponse = "I don't know yet!!!";

      const expectedActions = [
        { type: "GET_STATIONS_START" },
        { type: "GET_STATIONS_SUCCESS", stations: cachedResponse }
      ];

      const store = mockStore({ main: { stations: [] } });

      return store
        .dispatch(actions.fetchStations({ useCache: true }))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    }); */
  });
});
