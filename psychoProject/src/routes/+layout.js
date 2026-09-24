import { env } from '$env/dynamic/public';

// Debug switch: `PUBLIC_NO_JS=1 npm run dev` serves every page without client-side JavaScript,
// exactly what a visitor with JS disabled (or a failed bundle load) gets.
export const csr = env.PUBLIC_NO_JS !== '1';
