import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
    {
        user_id: { type: String, required: true},
        meetingCode: { type: String, required: true },
        date: { type: Date, default: Date.now, required: true },
    }
)

const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting };