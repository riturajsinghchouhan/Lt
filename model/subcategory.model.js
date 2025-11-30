import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const SubCategorySchema = mongoose.Schema({
  _id: Number,
  catnm: {
    type: String,
    required: [true, "Category name is required"],
   
    trim: true
  },
  subcatnm: {
    type: String,
    required: [true, "Sub Category name is required"],
    
    unique: true,
    trim: true
  },
  subcaticonnm: {
    type: String,
    required: [true, "Sub Category icon name is required"],
    trim: true
  },
  weight: {
    type: String,
    required: [true, "Weight is required"],
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Price is required"]
  }
});

// Apply the uniqueValidator plugin
SubCategorySchema.plugin(uniqueValidator);

// Compile schema to model
const SubCategorySchemaModel = mongoose.model('subcategory_collection', SubCategorySchema);

export default SubCategorySchemaModel;
