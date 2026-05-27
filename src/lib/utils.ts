// Minimal `cn` helper similar to classnames/clsx
export function cn(...inputs: Array<string | Record<string, boolean> | false | null | undefined>) {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'object') {
      for (const [k, v] of Object.entries(input) as [string, boolean][]) {
        if (v) classes.push(k);
      }
    }
  }
  return classes.join(' ');
}
