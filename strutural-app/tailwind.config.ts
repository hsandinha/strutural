// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Você pode adicionar customizações de tema aqui no futuro
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // Adicionando o plugin de formulários
  ],
};
export default config;
