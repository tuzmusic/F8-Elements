// Redux
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

// API Fetching
import fetchMock from "fetch-mock";
import apiResponse, { mediaResponse } from "./__mocks__/apiResponse.js";

// My Code
import Station from "../src/models/Station";
import * as actions from "../src/redux/actions/stationActions";

// AsyncStorage
import "react-native";
import MockAsyncStorage from "mock-async-storage";

const mockStore = configureMockStore([thunk]);

describe("async fetching actions", () => {
  const firstStationJSON = apiResponse[0];
  const firstStationObject = Station.createFromApiResponse(firstStationJSON);
  const mainApiUrl = "http://joinelectro.com/wp-json/wp/v2/job-listings/";
  const mediaDataURL = "http://joinelectro.com/wp-json/wp/v2/media/817";
  const imageURL =
    "http://joinelectro.com/wp-content/uploads/2019/04/Charging-port-300x225.jpg";

  fetchMock.mock(mainApiUrl, apiResponse);
  fetchMock.mock(mediaDataURL, mediaResponse);

  describe("getImageForStation", () => {
    const imageUpdateStation = { ...firstStationJSON, imageURL };
    const expectedUpdateActions = [
      { type: "UPDATE_STATION", station: imageUpdateStation }
    ];

    it("should return an action with the updated station", async () => {
      const returnedAction = await actions._getImageURLForStation(
        firstStationObject
      );
      expect(returnedAction.type).toEqual("UPDATE_STATION");
      expect(returnedAction.station.imageURL).toEqual(imageURL);
    });
  });

  describe("fetchStations(shouldDownload)", () => {
    const downloadedResponse = {
      [firstStationJSON.id]: Station.createFromApiResponse(firstStationJSON)
    };
    const expectedGetActions = [
      { type: "GET_STATIONS_START" },
      { type: "GET_STATIONS_SUCCESS", stations: downloadedResponse }
    ];

    it("gets stations from the website and dispatches them to the store", () => {
      const store = mockStore({ main: { stations: [] } });

      return store
        .dispatch(actions.fetchStations({ shouldDownload: true }))
        .then(() => {
          expect(store.getActions()).toEqual(expectedGetActions);
        });
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
