const mongoose = require("mongoose");
    const carModelSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            min: 1,
            max: 40
        }
      
    
    });

const CarModel = mongoose.model("CarModel",carModelSchema);
module.exports.CarModel = CarModel;
module.exports.CarModelSchema= carModelSchema;

