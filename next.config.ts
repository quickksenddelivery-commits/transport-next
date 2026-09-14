import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfkit loads its bundled AFM font-metric files via fs.readFileSync
  // relative to its own package directory at runtime. Left to the default
  // bundling, Turbopack/webpack pull in only the JS it can see statically
  // and drop those data files, so PDF generation (AWB/invoice/packing-list)
  // fails on Vercel with an ENOENT once deployed. Marking it external keeps
  // it as a plain node_modules require, so the whole package — data files
  // included — ships intact.
  serverExternalPackages: ["pdfkit"],
};

export default nextConfig;
