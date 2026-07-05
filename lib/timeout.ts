/** Bounds a promise (or Supabase's PromiseLike query builder) so a stalled
 * connection can't leave the UI stuck waiting forever. */
export function withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timed out")), ms)),
  ]);
}
