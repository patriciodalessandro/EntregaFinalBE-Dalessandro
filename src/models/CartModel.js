import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const cartSchema = new Schema({
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product', // referencia al modelo Product
        required: true
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1
      }
    }
  ]
}, { timestamps: true });

const CartModel = model('Cart', cartSchema);

export default CartModel;
