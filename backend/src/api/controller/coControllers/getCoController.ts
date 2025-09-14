/** @format */

// get multiple companies
import CompanyModel from "../../models/companyModel";
import catchAsync from "../../utils/catchAsync";
import { getOne } from "../../utils/handlerFactories";
import QueryBuilder from "../../utils/QueryBuilder";

const SELECTED_FIELDS =
  "name permalink homepage_url category_code founded_year number_of_employees description overview total_money_raised";

const FILTER_FIELDS = [
  "founded_year",
  "number_of_employees",
  "total_money_raised",
];

const SORT_FIELDS = [
  "founded_year",
  "number_of_employees",
  "-founded_year",
  "-number_of_employees",
];

export const getMultCo = catchAsync(async (req, res) => {
  const queryInstance = new QueryBuilder({
    query: CompanyModel.find(),
    queryString: req.query,
  });
  queryInstance
    .search()
    .filter(FILTER_FIELDS)
    .sort(SORT_FIELDS)
    .limitedFields(SELECTED_FIELDS);
  await queryInstance.paginate();

  const companies = await queryInstance.query;
  const currAmount = companies.length;

  res.status(200).json({
    status: "success",
    totalResult: queryInstance.totalResults,
    totalPages: Math.ceil(queryInstance.totalResults / currAmount),
    amount: currAmount,
    data: companies,
  });
});

export const getSingleCo = getOne(CompanyModel);
