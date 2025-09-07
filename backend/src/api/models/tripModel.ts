/** @format */

import mongoose, { Schema } from "mongoose";
import { IStationLocation, ITrip } from "../interface/ITrip";

const StationLocationSchema = new Schema<IStationLocation>({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
    validate: {
      validator: (val: number[]) => val.length === 2,
      message: "Coordinates must be an array of [longitude, latitude]",
    },
  },
});

const tripSchema = new Schema<ITrip>(
  {
    tripduration: { type: Number, required: true },
    start_station_id: { type: Number, required: true },
    start_station_name: { type: String, required: true, trim: true },
    end_station_id: { type: Number, required: true },
    end_station_name: { type: String, required: true, trim: true },
    bikeid: { type: Number, required: true },
    usertype: {
      type: String,
      enum: ["Subscriber", "Customer"],
      required: true,
    },
    birth_year: { type: Number, min: 1900, max: new Date().getFullYear() },

    start_station_location: {
      type: StationLocationSchema,
      required: true,
      index: "2dsphere", // enable geospatial queries
    },
    end_station_location: {
      type: StationLocationSchema,
      required: true,
      index: "2dsphere",
    },

    start_time: { type: Date, required: true },
    stop_time: { type: Date, required: true },
  },
  { timestamps: true }
);

const TripModel = mongoose.model<ITrip>("Trip", tripSchema);

export default TripModel;
