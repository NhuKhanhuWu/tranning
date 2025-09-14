/** @format */

import { Query } from "mongoose";
import { ParsedQs } from "qs";
import AppError from "./AppError";

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

  // -------------------- Helper Functions --------------------

  _isReservedField(field: string) {
    return EXCLUDED_FIELDS.includes(field);
  }

  _parseOperator(key: string) {
    const match = key.match(/^(.+)_(gte|gt|lte|lt|ne|in)$/);
    if (match) {
      return { field: match[1], operator: `$${match[2]}` };
    }
    return { field: key, operator: null };
  }

  _convertValue(value: string | number) {
    if (!isNaN(Number(value)) && value !== "") return Number(value);
    return value;
  }

  _validateField(
    field: string,
    allowedFields: string | any[],
    invalidFields: any[]
  ) {
    if (allowedFields.length && !allowedFields.includes(field)) {
      invalidFields.push(field);
      return false;
    }
    return true;
  }

  _buildMongoQuery(allowedFields: string[] = []) {
    const mongoQuery: Record<string, any> = {};
    const invalidFields: any[] = [];

    Object.keys(this.queryString).forEach((key) => {
      if (this._isReservedField(key)) return;

      const { field, operator } = this._parseOperator(key);
      if (!field) return; // make sure field is defined

      // Validate allowed fields
      if (!this._validateField(field, allowedFields, invalidFields)) return;

      const value = this._convertValue(this.queryString[key]);

      if (operator) {
        if (!mongoQuery[field]) mongoQuery[field] = {};
        mongoQuery[field][operator] = value;
      } else {
        mongoQuery[field] = value;
      }
    });

    if (invalidFields.length > 0) {
      throw new AppError(
        `Filtering by the following fields is not allowed: ${invalidFields.join(
          ", "
        )}`,
        400
      );
    }

    return mongoQuery;
  }

  // -------------------- Public Methods --------------------

  filter(allowedFields: string[] = []) {
    const mongoQuery = this._buildMongoQuery(allowedFields);
    this.query = this.query.find(mongoQuery);
    return this;
  }

  search() {
    const { name } = this.queryString;

    if (!name) return this;

    this.query = this.query.find({ $text: { $search: String(name) } });

    return this;
  }

  sort(allowedFields: string[] = []) {
    const sortBy = this.queryString.sort;
    console.log("sortBy:", sortBy);

    // if there is more than one field to sort by => throw error
    if (Array.isArray(sortBy)) {
      throw new AppError("Sorting by multiple fields is not allowed", 400);
    }

    // if fields priovided is not allowed => throw error
    if (!allowedFields.includes(String(sortBy))) {
      throw new AppError(
        `Sorting by the following field is not allowed: ${sortBy}`,
        400
      );
    }

    // sort
    this.query = this.query.sort(sortBy);

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
