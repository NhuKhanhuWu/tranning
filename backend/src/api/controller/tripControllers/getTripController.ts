/** @format */

import TripModel from "../../models/tripModel";
import catchAsync from "../../utils/catchAsync";
import { getOne } from "../../utils/handlerFactories";
import QueryBuilder from "../../utils/QueryBuilder";

const fields =
  "tripduration start_station_name end_station_name start_time stop_time usertype";

export const getMultTrip = catchAsync(async (req, res) => {
  const queryInstance = new QueryBuilder({
    query: TripModel.find(),
    queryString: req.query,
  });
  queryInstance.limitedFields(fields);
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
