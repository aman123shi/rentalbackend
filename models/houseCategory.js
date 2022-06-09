const mongoose = require("mongoose");
    const houseCategoryModelSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            min: 1,
            max: 40
        },
        bedrooms:Boolean,
        bathrooms:Boolean
      
    
    });

const HouseModel = mongoose.model("HouseModel",carModelSchema);
module.exports.House = HouseModel;
module.exports.houseModelSchema = houseModelSchema;