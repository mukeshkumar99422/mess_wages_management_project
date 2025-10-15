import mongoose, {Schema} from "mongoose";

const itemSchema = new Schema({
    main: {
        type: [String],
        required: true
    },
    extras: {
        type: [
            {
                name: {type: String, required: true},
                price: {type: Number, required: true}
            }
        ],
        required: true
    }
}, {_id: false});

const menuSchema = new Schema({
    date: {
        type: Date,
        required: true,
        unique: true,
        index: true
    },
    day: {
        type: String,
        required: true,
        enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    breakfast: {
        type: itemSchema,
        required: true
    },
    lunch: {
        type: itemSchema,
        required: true
    },
    dinner: {
        type: itemSchema,
        required: true
    }
}, {timestamps: true});

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;
