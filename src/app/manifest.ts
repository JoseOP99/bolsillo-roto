import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bolsillo Roto",
    short_name: "Bolsillo",
    description: "Tu dinero, bajo control",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1019",
    theme_color: "#0b1019",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
    shortcuts: [
      { name: "Registrar gasto", url: "/?quick=expense" },
      { name: "Registrar ingreso", url: "/?quick=income" },
    ],
  };
}
