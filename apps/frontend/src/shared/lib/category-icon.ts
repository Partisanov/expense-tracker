const iconMap: Record<string, string> = {
  'food-drinks': '🍕',
  transport: '🚗',
  shopping: '🛍️',
  entertainment: '🎮',
  health: '💊',
};

export function getCategoryIcon(icon: string | null, name: string): string {
  if (icon && iconMap[icon]) return iconMap[icon];
  return name.charAt(0).toUpperCase();
}
