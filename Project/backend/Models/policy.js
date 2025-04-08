const mongoose = require("mongoose");

const nomineeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    relation: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    contribution: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const policySchema = new mongoose.Schema(
  {
    Basic_Details: {
      title: {
        type: String,
        required: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      middleName: {
        type: String,
      },
      lastName: {
        type: String,
        required: true,
      },
      mobile: {
        type: String,
        required: true,
      },
      email: { type: String, required: true },
      address: { type: String, required: true },
      occupation: { type: String, required: true },
      dob: { type: Date, required: true },
      income: { type: Number, required: true },
      gender: { type: String, required: true },
    },

    BMI: {
      heightCm: { type: Number, required: true },
      heightFt: { type: Number, required: true },
      weight: { type: Number, required: true },
      bmi: { type: Number, required: true },
    },

    lifestyle: {
      smoking: {
        freq: { type: Number, default: 0 },
        quantity: { type: Number, default: 0 },
      },
      drinking: {
        freq: { type: Number, default: 0 },
        quantity: { type: Number, default: 0 },
      },
      panMasala: {
        freq: { type: Number, default: 0 },
        quantity: { type: Number, default: 0 },
      },
      others: { type: String, default: "" },
    },

    medicalHistory: { type: String },

    nominees: {
      type: [nomineeSchema],
      validate: {
        validator: function (v) {
          if (v.length === 0) return false;
          const totalContribution = v.reduce(
            (sum, nominee) => sum + nominee.contribution,
            0
          );
          return totalContribution === 100;
        },
      },
      required: true,
    },

    additional: {
      pan: { type: String },
      aadhar: { type: String },
      gstNumber: { type: String },
    },
  },
  { timestamps: true }
);

const Policy = mongoose.model("Policy", policySchema);
module.exports = Policy;
