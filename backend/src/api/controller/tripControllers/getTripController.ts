/** @format */

import TripModel from "../../models/tripModel";
import catchAsync from "../../utils/catchAsync";
import { getOne } from "../../utils/handlerFactories";
import QueryBuilder from "../../utils/QueryBuilder";

const SELECTED_FIELDS =
  "tripduration start_station_name end_station_name start_time stop_time usertype";
const FILTER_FIELDS = ["tripduration", "usertype"];
const SORT_FIELDS = [
  "tripduration",
  "start_time",
  "stop_time",
  "-tripduration",
  "-start_time",
  "-stop_time",
];

export const getMultTrip = catchAsync(async (req, res) => {
  const queryInstance = new QueryBuilder({
    query: TripModel.find(),
    queryString: req.query,
  });
  queryInstance
    .filter(FILTER_FIELDS)
    .sort(SORT_FIELDS)
    .limitedFields(SELECTED_FIELDS);
  await queryInstance.paginate();

  const trips = await queryInstance.query;
  const currAmount = trips.length;

  res.status(200).json({
    status: "success",
    totalResult: queryInstance.totalResults,
    totalPages: Math.ceil(queryInstance.totalResults / currAmount),
    amount: currAmount,
    data: trips,
  });
});

export const getSingleTrip = getOne(TripModel);
