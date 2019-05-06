import { AsyncStorage } from "react-native";
import Station from "../../models/Station";

export function saveStations(stations) {
  const data = { stations, savedDate: new Date() };
  AsyncStorage.setItem("electro_stations", JSON.stringify(data));
}

export function updateStation(dispatch, station, key, value) {
  dispatch({ type: "UPDATE_STATION", payload: { ...station, [key]: value } });
}

export function fetchStations({ useCache, shouldDownload }, attempt = 0) {
  return async dispatch => {
    dispatch({ type: "GET_STATIONS_START" });
    if (useCache) {
      await _getCachedStations(dispatch, attempt);
      if (shouldDownload) _downloadStations(dispatch, 2);
    } else if (shouldDownload) {
      _downloadStations(dispatch, attempt);
    }
  };
}

async function _getCachedStations(dispatch, attempt = 0) {
  console.log("Getting cached stations");
  try {
    const data = await AsyncStorage.getItem("electro_stations");
    if (data === null) {
      console.log("requested key returns null");
      return;
    }
    const stations = JSON.parse(data).stations;
    Object.values(stations).forEach(
      json => (stations[json.id] = new Station(json))
    );
    console.log("From cache method:", Object.values(stations)[0]);

    dispatch({ type: "GET_STATIONS_SUCCESS", stations });
  } catch (error) {
    console.log("Couldn't get cached stations:", error);
    dispatch({ type: "GET_STATIONS_FAILURE", payload: error });
  }
}

function _downloadStations(dispatch, attempt = 0) {
  console.log("Downloading stations");
  fetch("http://joinelectro.com/wp-json/wp/v2/job-listings/")
    .then(res => res.json())
    .then(async json => {
      const stations = Object.assign(
        {},
        ...json.map(s => ({ [s.id]: Station.createFromApiResponse(s) }))
      );
      console.log("From download method:", Object.values(stations)[0]);
      await _getImagesForAllStations(dispatch, stations);
      dispatch({ type: "GET_STATIONS_SUCCESS", stations });
      // saveStations(stations);
    })
    .catch(error => {
      console.warn("Couldn't download stations:", error);
      dispatch({ type: "GET_STATIONS_FAILURE", payload: error });
      if (attempt < 2) _getCachedStations(dispatch, attempt + 1);
    });
}

function _getImagesForAllStations(dispatch, stations) {
  Object.values(stations).forEach(station =>
    _getImageForStation(dispatch, station)
  );
}

export function getImageForStation(station) {
  return dispatch => {
    _getImageForStation(dispatch, station);
  };
}

function _getImageForStation(dispatch, station) {
  if ((url = station.mediaDataURL)) {
    fetch(url)
      .then(res => res.json())
      .then(json => {
        const imageURL = json.media_details.sizes.medium.source_url;
        updateStation(dispatch, station, "imageURL", imageURL);
      })
      .catch(error => console.warn(error));
  }
}

export function setCurrentStationID(id) {
  return dispatch => {
    dispatch({ type: "SET_CURRENT_STATION", payload: id });
  };
}

export function setUserInQuestion(user) {
  return dispatch => {
    dispatch({ type: "SET_USER_IN_QUESTION", payload: user });
  };
}

export function createStation(formData) {
  return async dispatch => {
    const station = new Station(formData);
    try {
      // const returnedStation = await postStationToApi(station);
      await dispatch({ type: "CREATE_STATION", payload: station }); // will eventually be dispatching returnedStation
      dispatch({ type: "SAVE_STATIONS" });
      return station;
    } catch (error) {
      dispatch({ type: "CREATE_STATION_ERROR", payload: error });
    }
  };
}

export function deleteStation(station) {
  return dispatch => {
    dispatch({ type: "DELETE_STATION", payload: station });
    dispatch({ type: "SAVE_STATIONS" });
  };
}

function _postStationToApi(station) {
  const apiFriendlyStation = Station.createForApiPost(station);
  // POST apiFriendlyStation to API
  fetch("url")
    .then(res => res.json())
    .then(json => {
      return json; // this may not be quite right...
    })
    .catch(error => {
      return error;
    });
}
