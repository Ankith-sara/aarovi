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
            customizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'customization' },
            gender: String,
            dressType: String,
            fabric: String,
            color: String,
            neckStyle: String,
            sleeveStyle: String,
            measurements: {
                bust: String,
                waist: String,
                hips: String,
                shoulder: String,
                sleeveLength: String,
                length: String,
                customNotes: String
            },
            canvasDesign: {
                json: String,
                svg: String,
                png: String,
                backgroundImage: String
            },
            designNotes: String,
            referenceImages: [String],
            aiPrompt: String
        },
        productionStatus: { 
            type: String, 
            enum: ['DESIGNING', 'CUTTING', 'STITCHING', 'QC', 'READY'], 
            default: 'DESIGNING' 
        },
        image: String
    }],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: 'Order placed' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number, required: true }
}, {
    timestamps: true
})

// Indexes for performance
orderSchema.index({ userId: 1, date: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'items.productId': 1 });
orderSchema.index({ 'items.type': 1 });

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)

export default orderModel;