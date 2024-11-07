import mongoose, { Schema, Document } from "mongoose";

interface IShortUrl extends Document {
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  clicks: number;
}

const ShortUrlSchema: Schema = new Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  clicks: { type: Number, default: 0 },
});

const ShortUrl = mongoose.model<IShortUrl>("ShortUrl", ShortUrlSchema);

export default ShortUrl;
