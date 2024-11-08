import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please add a name"],
    },
    email: {
      type: String,
      required: [true, "please add an email"],
      unique: true,
    },
    username: {
      type: String,
      required: [true, "please add a username"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password needed"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    rubbish: {
      type: String,
      default: "E6yt1yJFt5L1zb0tTrbLuESp2G8r25jGFgsYX0xmhRMsHIpwyUCdVFcyc7OfFG4R3e"
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
