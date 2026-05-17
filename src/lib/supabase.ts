import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type OrderStatus =
  | "pendiente_pago"
  | "pendiente_verificacion"
  | "verificado"
  | "enviado"
  | "entregado"
  | "cancelado";

export interface Order {
  id: string;
  created_at: string;
  status: OrderStatus;
  total: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  payment_proof_url: string | null;
  notes: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  price: number;
  qty: number;
  img_url: string;
}
