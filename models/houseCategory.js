const mongoose = require("mongoose");
    const houseModelSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            min: 1,
            max: 40
        }
      
    
    });

const HouseModel = mongoose.model("HouseModel",carModelSchema);
module.exports.HouseModel = HouseModel;
module.exports.houseModelSchema = houseModelSchema;