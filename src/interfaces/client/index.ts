import { MealPlanInterface } from 'interfaces/meal-plan';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface ClientInterface {
  id?: string;
  location: string;
  daily_calorie_intake: number;
  cultural_preferences: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  meal_plan?: MealPlanInterface[];
  user?: UserInterface;
  _count?: {
    meal_plan?: number;
  };
}

export interface ClientGetQueryInterface extends GetQueryInterface {
  id?: string;
  location?: string;
  cultural_preferences?: string;
  user_id?: string;
}
