const mongoose = require('mongoose');
const slugify = require('slugify');

const schemaTour = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      minlength: [10, 'The name must have more or equal than 10 letters'],
      maxlength: [40, 'The name must have less or equal than 40 letters'],
    },
    slug: String,
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above or equal 1'],
      max: [5, 'Rating must be below or equal 5'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'The difficulty of tour must be: easy, medium or difficult',
      },
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      priceDiscount: {
        type: Number,
        validate: {
          validator: function (val) {
            // Only works on CREATE and SAVE!!!
            return val == null || val < this.price;
          },
          message: 'Discount must be less than price',
        },
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schemaTour.virtual('TourWeek').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARS
schemaTour.pre('save', function (next) {
  this.slug = slugify('ZALUPA', { lower: true });
  next();
});

// eslint-disable-next-line prefer-arrow-callback
schemaTour.post('save', function (doc, next) {
  console.log(doc);
  next();
});

// QUERY MIDDLEWARS
schemaTour.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// eslint-disable-next-line prefer-arrow-callback
schemaTour.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} miliseconds`);
  console.log(docs);
  next();
});

// AGGREGATE MIDDLWARE
schemaTour.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', schemaTour);

module.exports = Tour;
