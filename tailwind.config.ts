import type { Config } from "tailwindcss";
export default { content: ["./src/**/*.{ts,tsx}"], theme: { extend: { colors: { ink: "#172033", navy: "#17365d", canvas: "#f5f7fb", line: "#e3e8f0" }, boxShadow: { card: "0 8px 30px rgba(31, 45, 61, .06)" } } }, plugins: [] } satisfies Config;
