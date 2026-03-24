import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    // Common fields
    type: { type: String, enum: ['READY_MADE', 'CUSTOM'], default: 'READY_MADE' },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    basePrice: { type: Number, required: true },
    finalPrice: { type: Number, required: true },
    image: { type: String, default: '' },

    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
    size: { type: String, default: '' },

    // Style customisations chosen on the Product page
    neckStyle: { type: String, default: '' },
    sleeveStyle: { type: String, default: '' },
    specialInstructions: { type: String, default: '' },

    productionStatus: {
        type: String,
        enum: ['DESIGNING', 'CUTTING', 'STITCHING', 'QC', 'READY'],
        default: 'DESIGNING'
    },
    customization: {
        customizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'customization' },
        gender: { type: String, default: '' },
        dressType: { type: String, default: '' },
        fabric: { type: String, default: '' },
        color: { type: String, default: '' },
        size: { type: String, default: '' },
        neckStyle: { type: String, default: '' },
        sleeveStyle: { type: String, default: '' },
        specialInstructions: { type: String, default: '' },
        canvasDesign: {
            svg: { type: String, default: '' },
            pngUrl: { type: String, default: '' },
            zoneColors: { type: mongoose.Schema.Types.Mixed, default: {} },
            zonePatterns: { type: mongoose.Schema.Types.Mixed, default: {} },
            sleeveStyle: { type: String, default: '' },
            baseColor: { type: String, default: '' },
            embroideryMetadata: { type: Array, default: [] }
        },
        measurements: {
            bust: { type: String, default: '' },
            waist: { type: String, default: '' },
            hips: { type: String, default: '' },
            shoulder: { type: String, default: '' },
            sleeveLength: { type: String, default: '' },
            length: { type: String, default: '' },
            customNotes: { type: String, default: '' }
        },
        designNotes: { type: String, default: '' },
        referenceImages: { type: Array, default: [] },
        aiPrompt: { type: String, default: '' }
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: [orderItemSchema], required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: {
        type: String,
        enum: ['Order Placed', 'Processing', 'Shipping', 'Out for delivery', 'Delivered', 'Cancelled'],
        default: 'Order Placed'
    },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, default: false },
    transactionId: { type: String, default: '' },
    date: { type: Number, required: true }
}, { timestamps: true });

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);
export default orderModel;