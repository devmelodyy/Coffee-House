import type { Metadata } from "next";
import { Checkout } from "./Checkout";

export const metadata: Metadata = { title: "ثبت سفارش" };

export default function CheckoutPage() {
  return <Checkout />;
}
