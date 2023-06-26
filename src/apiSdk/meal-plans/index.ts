import axios from 'axios';
import queryString from 'query-string';
import { MealPlanInterface, MealPlanGetQueryInterface } from 'interfaces/meal-plan';
import { GetQueryInterface } from '../../interfaces';

export const getMealPlans = async (query?: MealPlanGetQueryInterface) => {
  const response = await axios.get(`/api/meal-plans${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createMealPlan = async (mealPlan: MealPlanInterface) => {
  const response = await axios.post('/api/meal-plans', mealPlan);
  return response.data;
};

export const updateMealPlanById = async (id: string, mealPlan: MealPlanInterface) => {
  const response = await axios.put(`/api/meal-plans/${id}`, mealPlan);
  return response.data;
};

export const getMealPlanById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/meal-plans/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMealPlanById = async (id: string) => {
  const response = await axios.delete(`/api/meal-plans/${id}`);
  return response.data;
};
