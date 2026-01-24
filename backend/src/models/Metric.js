import mongoose from "mongoose";

const metricSchema = new mongoose.Schema({
  category: String,
  count: {
    type: Number,
    default: 0
  }
});

export default mongoose.model("Metric", metricSchema);
