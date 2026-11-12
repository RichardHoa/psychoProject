// `?enhanced` imports with explicit widths (see ./index.js); the package only types bare `?enhanced`.
declare module '*?enhanced&w=240;160;96;64' {
	import type { Picture } from 'vite-imagetools';

	const value: Picture;
	export default value;
}
