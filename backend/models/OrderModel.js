import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
        type: { type: String, enum: ['READY_MADE', 'CUSTOM'], default: 'READY_MADE' },
        name: String,
        quantity: Number,
        basePrice: Number,
        finalPrice: Number,
        size: String,
        customization: {
            gender: String,
            dressType: String,
            fabric: String,
            color: String,
            measurements: {
                bust: Number,
                waist: Number,
                hips: Number,
                shoulder: Number,
                sleeveLength: Number,
                length: Number,
                customNotes: String
            },
            designNotes: String,
            referenceImages: [String],
            aiPrompt: String
        },
        productionStatus: { type: String, enum: ['DESIGNING', 'CUTTING', 'STITCHING', 'QC', 'READY'], default: 'DESIGNING' },
        image: String
    }],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: 'Order placed' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number, required: true }
})

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)

export default orderModel;