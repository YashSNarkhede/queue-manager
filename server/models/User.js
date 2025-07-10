import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate usernames
  },
  password: {
    type: String,
    required: true, // Password must be provided
  },
});

const User = mongoose.model("User", userSchema);

export default User;
