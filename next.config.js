// Ficheiro: next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // AVISO: Isto permite que o build de produção seja concluído com sucesso
    // mesmo que o seu projeto tenha erros de ESLint.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;