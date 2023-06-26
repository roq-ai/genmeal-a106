import axios from 'axios';
import queryString from 'query-string';
import { NutritionistInterface, NutritionistGetQueryInterface } from 'interfaces/nutritionist';
import { GetQueryInterface } from '../../interfaces';

export const getNutritionists = async (query?: NutritionistGetQueryInterface) => {
  const response = await axios.get(`/api/nutritionists${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createNutritionist = async (nutritionist: NutritionistInterface) => {
  const response = await axios.post('/api/nutritionists', nutritionist);
  return response.data;
};

export const updateNutritionistById = async (id: string, nutritionist: NutritionistInterface) => {
  const response = await axios.put(`/api/nutritionists/${id}`, nutritionist);
  return response.data;
};

export const getNutritionistById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/nutritionists/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteNutritionistById = async (id: string) => {
  const response = await axios.delete(`/api/nutritionists/${id}`);
  return response.data;
};
