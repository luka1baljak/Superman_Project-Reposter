const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  privatno: {
    type: Boolean,
    default: false
  },
  ytlink: {
    type: String
  },
  imglink: {
    type: String
  },
  reglinks: [
    {
      type: String
    }
  ],
  hashlink: [
    {
      type: String
    }
  ],
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});
PostSchema.plugin(mongoosePaginate);
//Stvaranje indexa za pretraživanje postova
//PostSchema.index({ hashlink: "array" });
module.exports = Post = mongoose.model("post", PostSchema);
