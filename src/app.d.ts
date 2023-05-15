// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Error {
      message: string;
      details?: string | Record<unknown, unknown>;
    }
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
