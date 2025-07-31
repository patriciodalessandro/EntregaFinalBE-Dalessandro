import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  code: { type: String, required: true, unique: true },
  price: Number,
  status: { type: Boolean, default: true },
  stock: Number,
  category: String,
  thumbnails: [String],
});

ProductSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model('Product', ProductSchema);

export default ProductModel;
