import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ['Audio', 'Wearables', 'Computing', 'Smart Home', 'Accessories'],
    },
    image: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 42,
    },
    stockCount: {
      type: Number,
      default: 15,
      min: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    tag: {
      type: String,
      default: '', // 'Best Seller', 'New Arrival', 'Staff Pick', 'Limited'
    },
    features: {
      type: [String],
      default: [],
    },
    specs: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for ID serialization
productSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  },
});

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
