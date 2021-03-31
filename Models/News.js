const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const newsSchema = new Schema({
  uuid: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: false,
  },
  author: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: false
  },
}, { timestamps: true });

newsSchema.plugin(mongoosePaginate);

const News = mongoose.model('News', newsSchema);
module.exports = News;