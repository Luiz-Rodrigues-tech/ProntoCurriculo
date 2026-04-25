import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

const accessToken = process.env.MP_ACCESS_TOKEN ?? "";

export const mpClient = new MercadoPagoConfig({ accessToken });
export const mpPayment = new Payment(mpClient);
export const mpPreference = new Preference(mpClient);

export const PRICE = 9.9;
export const PRODUCT_DESCRIPTION = "ProntoCurrículo — Download PDF sem marca d'água";
