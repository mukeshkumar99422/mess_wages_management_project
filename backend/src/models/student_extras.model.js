import mongoose, {Schema} from "mongoose";

const extrasSchema = new Schema({
    student_id: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        index: true
    },
    date: {
        type: Date,
        required: true,
        unique: true
    },
    items: {
        type: [
            {
                name: {type: String, required: true},
                price: {type: Number, required: true}
            }
        ],
        required: true
    }
    
}, {timestamps: true}); 

const StudentExtras = mongoose.model('StudentExtras', extrasSchema);

export default StudentExtras;

