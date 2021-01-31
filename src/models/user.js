const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

// creating schema seperately allows the use of middleware
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [7, "password is to short"],
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password cannot contain 'password' ");
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      }
    ],
    
    avatar:{
      type:Buffer
    },
  },
  { 
    timestamps:true
    }
);

//not stored in database
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

// userSchema.methods.getPublicProfile = function(){

//     const user=this

//     const userObject=user.toObject();

//     delete userObject.password

//     delete userObject.tokens

//     return userObject
// }

//it runs even if weexplicitly dont call it runs JSON.strigify on the res.send
userSchema.methods.toJSON = function () {
  const user = this;

  const userObject = user.toObject();

  delete userObject.password;

  delete userObject.tokens;

  delete userObject.avatar;
  
  return userObject;
};

//methods are instance methjod they are called using the instance
userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });

  await user.save();

  return token;
};

//statics methods are also called as model method they are also
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

//before saving hash the password
//the callback should be a simple function not an arrow becase of the this binding
userSchema.pre("save", async function (next) {
  const user = this;

  //it will be true when the user is first created and also be true when the user is updated
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

//delete user tasks when user is remove
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
