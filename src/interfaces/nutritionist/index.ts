import { MealPlanInterface } from 'interfaces/meal-plan';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface NutritionistInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  meal_plan?: MealPlanInterface[];
  user?: UserInterface;
  _count?: {
    meal_plan?: number;
  };
}

export interface NutritionistGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
