const mapping: Record<string, string> = {
  clients: 'client',
  'meal-plans': 'meal_plan',
  nutritionists: 'nutritionist',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
