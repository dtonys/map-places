import mongoose, { Schema } from 'mongoose';


const PlaceSchema = new Schema({
  coordinates: {
    type: [ Number ],
    index: '2dsphere',
  },
  name: String,
});

const Place  = mongoose.model('place', PlaceSchema);

module.exports = Place;
