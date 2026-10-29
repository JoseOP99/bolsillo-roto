import { z } from "zod";
export const transactionSchema = z.object({
  description: z.string().trim().min(2).max(160),
  amount: z
    .number()
    .positive()
    .max(1e12)
    .refine(
      (v) => Math.abs(v * 100 - Math.round(v * 100)) < 0.001,
      "Máximo dos decimales",
    ),
  kind: z.enum(["income", "expense"]),
  category: z.enum(["Necesidades", "Deseos", "Ahorro"]),
  account_id: z.string().uuid(),
  occurred_on: z.iso.date(),
  installments: z.number().int().min(1).max(120).default(1),
});
export type TransactionInput = z.infer<typeof transactionSchema>;
