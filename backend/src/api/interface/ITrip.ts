/** @format */

export interface IStationLocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface ITrip extends Document {
  tripduration: number;
  start_station_id: number;
  start_station_name: string;
  end_station_id: number;
  end_station_name: string;
  bikeid: number;
  usertype: "Subscriber" | "Customer";
  birth_year?: number;

  start_station_location: IStationLocation;
  end_station_location: IStationLocation;

  start_time: Date;
  stop_time: Date;
}
