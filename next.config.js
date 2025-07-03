// Ficheiro: next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para ignorar erros de ESLint
  eslint: {
    // AVISO: Isto permite que o build de produção seja concluído com sucesso
    // mesmo que o seu projeto tenha erros de ESLint.
    ignoreDuringBuilds: true,
  },
  // NOVA CONFIGURAÇÃO para ignorar erros de TypeScript
  typescript: {
    // AVISO: Isto permite que o build de produção seja concluído com sucesso
    // mesmo que o seu projeto tenha erros de tipo do TypeScript.
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;