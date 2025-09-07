/** @format */

import { Document, Types } from "mongoose";

export interface IImage {
  available_sizes: any[][];
  attribution?: string;
}

export interface IProduct {
  name?: string;
  permalink?: string;
}

export interface IRelationship {
  is_past: boolean;
  title?: string;
  person?: {
    first_name?: string;
    last_name?: string;
    permalink?: string;
  };
}

export interface ICompetition {
  competitor?: {
    name?: string;
    permalink?: string;
  };
}

export interface IOffice {
  description?: string;
  address1?: string;
  address2?: string;
  zip_code?: string;
  city?: string;
  state_code?: string;
  country_code?: string;
  latitude?: number;
  longitude?: number;
}

export interface ICompany extends Document {
  _id: Types.ObjectId;

  name: string;
  permalink?: string;
  crunchbase_url?: string;
  homepage_url?: string;
  blog_url?: string;
  blog_feed_url?: string;
  twitter_username?: string;
  category_code?: string;
  number_of_employees?: number;
  founded_year?: number;
  founded_month?: number;
  founded_day?: number;
  deadpooled_year?: number;
  deadpooled_month?: number;
  deadpooled_day?: number;
  deadpooled_url?: string;
  tag_list?: string[];
  alias_list?: string[];
  email_address?: string;
  phone_number?: string;
  description?: string;
  overview?: string;

  image?: IImage;
  products?: IProduct[];
  relationships?: IRelationship[];
  competitions?: ICompetition[];
  providerships?: string[];
  total_money_raised?: string;

  funding_rounds?: any[];
  investments?: any[];
  acquisition?: any;
  acquisitions?: any[];
  offices?: IOffice[];
  milestones?: any[];
  ipo?: any;
  video_embeds?: any[];
  screenshots?: any[];
  external_links?: any[];
  partners?: any[];

  createdAt?: Date; // timestamps
  updatedAt?: Date;
}
