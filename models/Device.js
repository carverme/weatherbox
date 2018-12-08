const mongoose = require('mongoose');
const User = require('../models/User');

const deviceSchema = new mongoose.Schema({
  name: String,
  devId: String
});

deviceSchema.set("toObject", {
  transform: function(doc, ret, options) {
    let returnJson = {
      _id: ret._id,
      name: ret.name,
      devId: ret.devId
    }
    return returnJson
  }
});


const Device = mongoose.model('Device', deviceSchema);
module.exports = Device;
