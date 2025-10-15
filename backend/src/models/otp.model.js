import mongoose, {Schema} from "mongoose";

const otpSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        index: true
    },
    otpHashed: String,
    expiresAt: Date,
    attempts: {
        type: Number,
        default: 0
    },
    used: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

 export const OTP = mongoose.model('OTP', otpSchema)