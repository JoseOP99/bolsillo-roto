import { ArrowUpRight } from "lucide-react";
export function ProductBrand() {
  return (
    <a className="product-brand" href="/" aria-label="Bolsillo Roto, inicio">
      <img src="/logo.png" width="60" height="64" alt="" />
      <span>
        Bolsillo Roto<span>Tu dinero, en orden.</span>
      </span>
    </a>
  );
}
export function ZenubitSignature() {
  return (
    <a
      className="zenubit-signature"
      href="https://zenubit.com"
      target="_blank"
      rel="noreferrer"
    >
      <img src="/zenubit-mark.webp" width="40" height="45" alt="" />
      <span>
        Creado por <b>Zenubit</b>
      </span>
      <ArrowUpRight size={15} />
    </a>
  );
}
