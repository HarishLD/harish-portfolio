/** Joins truthy class names. Tiny on purpose: no clsx/tailwind-merge dependency. */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
