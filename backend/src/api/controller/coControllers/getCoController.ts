/** @format */

// get multiple companies
import CompanyModel from "../../models/companyModel";
import catchAsync from "../../utils/catchAsync";
import { getOne } from "../../utils/handlerFactories";
import CoQuery from "../../utils/QueryBuilder";

const fields =
  "name permalink homepage_url category_code founded_year number_of_employees description overview total_money_raised";

export const getMultCoController = catchAsync(async (req, res) => {
  const queryInstance = new CoQuery({
    query: CompanyModel.find(),
    queryString: req.query,
  });
  queryInstance.search().limitedFields(fields);
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

export const getSingleCoController = getOne(CompanyModel);
