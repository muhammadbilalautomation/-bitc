export type AppTheme = "light" | "dark";

export function nextTheme(theme: AppTheme): AppTheme {
  return theme === "light" ? "dark" : "light";
}

export function isDarkTheme(theme: AppTheme): boolean {
  return theme === "dark";
}
