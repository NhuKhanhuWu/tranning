/** @format */

import mongoose from "mongoose";
import validator from "validator";

const { Schema } = mongoose;

// Reusable sub-schemas
const ImageSchema = new Schema({
  available_sizes: [[Schema.Types.Mixed]], // some are nested arrays
  attribution: String,
});

const ProductSchema = new Schema({
  name: { type: String, trim: true },
  permalink: { type: String, trim: true },
});

const RelationshipSchema = new Schema({
  is_past: { type: Boolean, default: false },
  title: { type: String, trim: true },
  person: {
    first_name: String,
    last_name: String,
    permalink: String,
  },
});

const CompetitionSchema = new Schema({
  competitor: {
    name: String,
    permalink: String,
  },
});

const OfficeSchema = new Schema({
  description: String,
  address1: String,
  address2: String,
  zip_code: String,
  city: String,
  state_code: String,
  country_code: String,
  latitude: Number,
  longitude: Number,
});

// Main Company schema
const companySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    permalink: { type: String, unique: true, index: true },
    crunchbase_url: {
      type: String,
      validate: {
        validator: (v: string) => !v || validator.isURL(v),
        message: "Invalid crunchbase URL",
      },
    },
    homepage_url: {
      type: String,
      validate: {
        validator: (v: string) => !v || validator.isURL(v),
        message: "Invalid homepage URL",
      },
    },
    blog_url: {
      type: String,
      validate: {
        validator: (v: string) => !v || validator.isURL(v),
        message: "Invalid blog URL",
      },
    },
    blog_feed_url: {
      type: String,
      validate: {
        validator: (v: string) => !v || validator.isURL(v),
        message: "Invalid blog feed URL",
      },
    },
    twitter_username: { type: String, trim: true },
    category_code: String,
    number_of_employees: { type: Number, min: 0 },
    founded_year: Number,
    founded_month: Number,
    founded_day: Number,
    deadpooled_year: Number,
    deadpooled_month: Number,
    deadpooled_day: Number,
    deadpooled_url: String,
    tag_list: [String],
    alias_list: [String],
    email_address: {
      type: String,
      lowercase: true,
      validate: {
        validator: (v: string) => !v || validator.isEmail(v),
        message: "Invalid email",
      },
    },
    phone_number: String,
    description: String,
    created_at: Date,
    updated_at: Date,
    overview: String,

    image: ImageSchema,
    products: [ProductSchema],
    relationships: [RelationshipSchema],
    competitions: [CompetitionSchema],
    providerships: [String],
    total_money_raised: String,

    funding_rounds: [Schema.Types.Mixed],
    investments: [Schema.Types.Mixed],
    acquisition: Schema.Types.Mixed,
    acquisitions: [Schema.Types.Mixed],
    offices: [OfficeSchema],
    milestones: [Schema.Types.Mixed],
    ipo: Schema.Types.Mixed,
    video_embeds: [Schema.Types.Mixed],
    screenshots: [Schema.Types.Mixed],
    external_links: [Schema.Types.Mixed],
    partners: [Schema.Types.Mixed],
  },
  {
    timestamps: true, // auto add createdAt, updatedAt
  }
);

// Create a text index on `name` and `description` => supports text search
companySchema.index({ name: "text", description: "text" });

const CompanyModel = mongoose.model("Company", companySchema);

export default CompanyModel;
