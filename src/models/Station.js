// @flow

import uuid from "react-native-uuid";
import type { ElectroLocation, OpenObject } from "../../flowTypes";

type unitOfDistance = "mi" | "km" | "nm";

export function distanceBetween(
  location1: ElectroLocation,
  location2: ElectroLocation,
  unit: unitOfDistance = "mi"
): number {
  if (
    location1.latitude == location2.latitude &&
    location1.longitude == location2.longitude
  ) {
    return 0;
  } else {
    var radlat1 = (Math.PI * location1.latitude) / 180;
    var radlat2 = (Math.PI * location2.latitude) / 180;
    var theta = location1.longitude - location2.longitude;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "km") {
      dist = dist * 1.609344;
    }
    if (unit == "nm") {
      dist = dist * 0.8684;
    }
    return Number(dist.toFixed(2));
  }
}

export default class Station {
  // #region PROPERTY DEFINITIONS
  id: string;
  originalJSON: { [key: string]: any };
  userID: string | number;
  title: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  content: string;
  location: ElectroLocation;
  priceFrom: string;
  priceTo: string;
  tagline: string;
  website: string;
  mediaID: number;
  mediaDataURL: string;
  imageURL: string;
  listingURL: string;
  // #endregion

  constructor(json?: Station) {
    if (!json) return;
    this.id = json.id || uuid.v1();
    this.originalJSON = json;
    this.userID = json.userID;
    this.title = json.title;
    this.address = json.address;
    this.contactEmail = json.contactEmail;
    this.contactPhone = json.contactPhone;
    this.content = json.content;
    this.location = json.location;
    this.priceFrom = json.priceFrom;
    this.priceTo = json.priceTo;
    this.tagline = json.tagline;
    this.website = json.website;
    this.mediaDataURL = json.mediaDataURL;
    this.imageURL = json.imageURL;
    this.listingURL = json.listingURL;
    // this.amenities = json.amenities;
  }

  distanceFromLocation = (
    location: ElectroLocation,
    unit: unitOfDistance = "mi"
  ): number => {
    return distanceBetween(this.location, location);
  };

  distanceFrom = (
    otherStation: Station,
    unit: unitOfDistance = "mi"
  ): number => {
    return distanceBetween(this.location, otherStation.location);
  };

  static createFromApiResponse(json: OpenObject) {
    function p(propName: string, prefix: string = "_"): string {
      const valueArray: string[] = json.listing_props[`${prefix}${propName}`];
      return valueArray[0] || "";
    }

    let station = new Station();
    station.originalJSON = json.originalJSON || json;
    station.id = json.id;
    station.listingURL = json.link;
    if (json.listing_props) {
      station.title =
        p("job_title") ||
        json.title.rendered ||
        console.warn("no title for station", json.id);
      station.content =
        p("job_description") ||
        json.content.rendered ||
        console.warn("no description for station", json.id);
      station.contactEmail = p("company_email");
      station.contactPhone = p("company_phone");
      station.address = p("job_location");
      station.location = {
        latitude: p("geolocation_lat", ""),
        longitude: p("geolocation_long", "")
      };
      station.priceFrom = p("company_price_from");
      station.priceTo = p("company_price_to");
      station.website = p("company_website");
      if (station.website && !station.website.startsWith("http"))
        station.website = "http://" + station.website;
    }
    // this.amenityIDs = [...json.job_listing_amenity];

    station.mediaID = json.featured_media;
    if (station.mediaID > 0) {
      station.mediaDataURL =
        "http://joinelectro.com/wp-json/wp/v2/media/" + station.mediaID;
    }
    return station;
  }

  static createForApiPost(json: OpenObject) {
    return {
      originalJSON: json,
      id: uuid.v1(), // ultimately this may need to be a string
      listing_props: {
        _job_title: [json.title],
        _job_description: [json.content],
        _job_location: [json.address],
        _company_tagline: [json.tagline],
        _company_website: [json.website],
        _company_email: [json.contactEmail],
        _company_phone: [json.contactPhone],
        _job_location: [json.address],
        _company_price_from: [json.priceFrom],
        _company_price_to: [json.priceTo],
        _company_website: [json.website],
        geolocation_lat: [json.location.lat], // may need to be converted to a string
        geolocation_long: [json.location.lng] // may need to be converted to a string
      }
      // job_listing_amenity: (array of amenity numbers),
      // featured_media: (media id)
    };
  }
}
