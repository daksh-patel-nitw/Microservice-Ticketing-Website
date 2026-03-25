import Stripe from "stripe";

if (!process.env.STRIPE_KEY) throw new Error('Stripe secret not found');

export const stripe = new Stripe(
    process.env.STRIPE_KEY, {
    apiVersion: '2026-02-25.clover'
})