/// <reference types="@sveltejs/kit" />
/// <reference types="@sveltejs/enhanced-img" />

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.svg?raw' {
  const value: string;
  export default value;
}

declare module 'svelte-slidy';

interface Window {
  dataLayer: unknown[];
}
