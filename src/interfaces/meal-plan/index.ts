import { ClientInterface } from 'interfaces/client';
import { NutritionistInterface } from 'interfaces/nutritionist';
import { GetQueryInterface } from 'interfaces';

export interface MealPlanInterface {
  id?: string;
  client_id?: string;
  nutritionist_id?: string;
  meal_type: string;
  meal_description: string;
  calories: number;
  created_at?: any;
  updated_at?: any;

  client?: ClientInterface;
  nutritionist?: NutritionistInterface;
  _count?: {};
}

export interface MealPlanGetQueryInterface extends GetQueryInterface {
  id?: string;
  client_id?: string;
  nutritionist_id?: string;
  meal_type?: string;
  meal_description?: string;
}
