const mongoose = require("mongoose");

const WebsiteStatusSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  reason: { type: String, default: "" },
});

module.exports = mongoose.model("WebsiteStatus", WebsiteStatusSchema);
