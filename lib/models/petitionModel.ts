import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export const PetitionSchema = new Schema({
  url: {
    type: String,
    required: "Enter Url",
  },
  rawData: {
    type: String,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});
