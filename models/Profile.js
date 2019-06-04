const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  datum_rodjenja: {
    type: Date
  },
  broj_telefona: {
    type: String
  },
  lokacija: {
    type: String
  },
  životni_moto: {
    type: String
  },
  privatno: {
    type:Boolean,
    default: false
  },
  datum: {
    type: Date,
    default: Date.now
  },
  followers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      name: {
        type:String
      },
      avatar:{
        type:String
      }
    }
  ],
  following: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      name: {
        type:String
      },
      avatar:{
        type:String
      }
    }
  ],
  social: {
    instagram: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    }
  }
});
ProfileSchema.plugin(mongoosePaginate);

module.exports = Profile = mongoose.model("profile", ProfileSchema);