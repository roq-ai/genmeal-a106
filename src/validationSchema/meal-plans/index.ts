import * as yup from 'yup';

export const mealPlanValidationSchema = yup.object().shape({
  meal_type: yup.string().required(),
  meal_description: yup.string().required(),
  calories: yup.number().integer().required(),
  client_id: yup.string().nullable(),
  nutritionist_id: yup.string().nullable(),
});
