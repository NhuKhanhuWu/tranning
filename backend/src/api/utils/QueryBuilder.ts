/** @format */

import { Query } from "mongoose";
import { ParsedQs } from "qs";

/** @format */
const EXCLUDED_FIELDS = [
  "page",
  "sort",
  "limit",
  "fields",
  "genres",
  "title",
  "match",
  "name",
];

interface IQueryBuilder {
  query: Query<any, any>; // A Mongoose query (can refine types later)
  queryString: ParsedQs | { [key: string]: any }; // Express req.query
}

class QueryBuilder {
  query: Query<any, any>;
  queryString: ParsedQs | { [key: string]: any };
  totalResults: number;

  constructor({ query, queryString }: IQueryBuilder) {
    this.query = query;
    this.queryString = queryString;
    this.totalResults = 0;
  }

  search() {
    const { name } = this.queryString;

    if (!name) return this;

    this.query = this.query.find({ $text: { $search: String(name) } });

    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    EXCLUDED_FIELDS.forEach((el) => delete queryObj[el]);

    // change filter structur => can filter more condition
    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    console.log(JSON.parse(queryStr));

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  limitedFields(fields: string) {
    this.query = this.query.select(fields);

    return this;
  }

  async paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count before applying pagination
    this.totalResults = await this.query.model.countDocuments(
      this.query.getQuery()
    );

    // Apply pagination
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default QueryBuilder;
