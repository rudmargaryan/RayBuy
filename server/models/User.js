import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: String,
    password: String,
});


export default mongoose.model('User',schema)