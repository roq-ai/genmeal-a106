import * as yup from 'yup';

export const clientValidationSchema = yup.object().shape({
  location: yup.string().required(),
  daily_calorie_intake: yup.number().integer().required(),
  cultural_preferences: yup.string().required(),
  user_id: yup.string().nullable(),
});
