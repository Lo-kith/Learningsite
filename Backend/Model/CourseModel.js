import mongoose from "mongoose";

const  courseSchema= new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  rating:{
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  reviews: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const Course = mongoose.model("Course", courseSchema);

export default Course;

