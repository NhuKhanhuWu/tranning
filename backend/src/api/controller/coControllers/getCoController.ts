/** @format */

// get multiple companies
import CompanyModel from "../../models/companyModel";
import catchAsync from "../../utils/catchAsync";
import { getOne } from "../../utils/handlerFactories";
import QueryBuilder from "../../utils/QueryBuilder";

const fields =
  "name permalink homepage_url category_code founded_year number_of_employees description overview total_money_raised";

export const getMultCo = catchAsync(async (req, res) => {
  const queryInstance = new QueryBuilder({
    query: CompanyModel.find(),
    queryString: req.query,
  });
  queryInstance.search().filter().limitedFields(fields);
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
