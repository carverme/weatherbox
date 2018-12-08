const mongoose = require('mongoose');
const User = require('../models/User');

const locationSchema = new mongoose.Schema({
  name: String,
  city: String,
  state: String,
  zipCode: Number,
  lat: Number,
  lng: Number
});

locationSchema.set("toObject", {
  transform: function(doc, ret, options) {
    let returnJson = {
      _id: ret._id,
      name: ret.name,
      city: ret.city,
      state: ret.state,
      zipCode: ret.zipCode,
      lat: ret.lat,
      lng: ret.lng
    }
    return returnJson;
  }
});


const Location = mongoose.model('Location', locationSchema);
module.exports = Location;
