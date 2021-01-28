const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const authorSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    nationality: String,
    birthday: Date,
    pictureUrl: String
  },
  {
    timestamps: true
  }
);

module.exports = model('Author', authorSchema);
