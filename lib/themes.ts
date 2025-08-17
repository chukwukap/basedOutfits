export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    border: string;
    card: string;
    cardForeground: string;
  };
}

export const themes: Theme[] = [
  {
    id: "light",
    name: "Light",
    colors: {
      primary: "222.2 84% 4.9%",
      secondary: "210 40% 96%",
      background: "0 0% 100%",
      foreground: "222.2 84% 4.9%",
      muted: "210 40% 96%",
      mutedForeground: "215.4 16.3% 46.9%",
      accent: "210 40% 96%",
      accentForeground: "222.2 84% 4.9%",
      border: "214.3 31.8% 91.4%",
      card: "0 0% 100%",
      cardForeground: "222.2 84% 4.9%",
    },
  },
  {
    id: "dark",
    name: "Dark",
    colors: {
      primary: "210 40% 98%",
      secondary: "217.2 32.6% 17.5%",
      background: "222.2 84% 4.9%",
      foreground: "210 40% 98%",
      muted: "217.2 32.6% 17.5%",
      mutedForeground: "215 20.2% 65.1%",
      accent: "217.2 32.6% 17.5%",
      accentForeground: "210 40% 98%",
      border: "217.2 32.6% 17.5%",
      card: "222.2 84% 4.9%",
      cardForeground: "210 40% 98%",
    },
  },
  {
    id: "minimal",
    name: "Minimal Blue",
    colors: {
      // Updated to a soft blue-accent minimal palette
      primary: "221.2 83.2% 53.3%", // blue-500
      secondary: "221 100% 97%", // very light blue tint
      background: "0 0% 100%",
      foreground: "0 0% 9%",
      muted: "221 100% 97%",
      mutedForeground: "221 15% 40%",
      accent: "221 100% 97%",
      accentForeground: "221.2 83.2% 53.3%",
      border: "221 60% 90%",
      card: "0 0% 100%",
      cardForeground: "0 0% 9%",
    },
  },
  {
    id: "pastel",
    name: "Pastel",
    colors: {
      primary: "340 82% 52%",
      secondary: "315 100% 96%",
      background: "330 100% 98%",
      foreground: "340 10% 15%",
      muted: "315 100% 96%",
      mutedForeground: "340 5% 55%",
      accent: "315 100% 96%",
      accentForeground: "340 82% 52%",
      border: "315 20% 90%",
      card: "330 100% 98%",
      cardForeground: "340 10% 15%",
    },
  },
];

export const defaultTheme = themes[0]; // Light theme
