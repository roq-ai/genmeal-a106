import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createMealPlan } from 'apiSdk/meal-plans';
import { Error } from 'components/error';
import { mealPlanValidationSchema } from 'validationSchema/meal-plans';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ClientInterface } from 'interfaces/client';
import { NutritionistInterface } from 'interfaces/nutritionist';
import { getClients } from 'apiSdk/clients';
import { getNutritionists } from 'apiSdk/nutritionists';
import { MealPlanInterface } from 'interfaces/meal-plan';

function MealPlanCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: MealPlanInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createMealPlan(values);
      resetForm();
      router.push('/meal-plans');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<MealPlanInterface>({
    initialValues: {
      meal_type: '',
      meal_description: '',
      calories: 0,
      client_id: (router.query.client_id as string) ?? null,
      nutritionist_id: (router.query.nutritionist_id as string) ?? null,
    },
    validationSchema: mealPlanValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Meal Plan
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="meal_type" mb="4" isInvalid={!!formik.errors?.meal_type}>
            <FormLabel>Meal Type</FormLabel>
            <Input type="text" name="meal_type" value={formik.values?.meal_type} onChange={formik.handleChange} />
            {formik.errors.meal_type && <FormErrorMessage>{formik.errors?.meal_type}</FormErrorMessage>}
          </FormControl>
          <FormControl id="meal_description" mb="4" isInvalid={!!formik.errors?.meal_description}>
            <FormLabel>Meal Description</FormLabel>
            <Input
              type="text"
              name="meal_description"
              value={formik.values?.meal_description}
              onChange={formik.handleChange}
            />
            {formik.errors.meal_description && <FormErrorMessage>{formik.errors?.meal_description}</FormErrorMessage>}
          </FormControl>
          <FormControl id="calories" mb="4" isInvalid={!!formik.errors?.calories}>
            <FormLabel>Calories</FormLabel>
            <NumberInput
              name="calories"
              value={formik.values?.calories}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('calories', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.calories && <FormErrorMessage>{formik.errors?.calories}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<ClientInterface>
            formik={formik}
            name={'client_id'}
            label={'Select Client'}
            placeholder={'Select Client'}
            fetcher={getClients}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.location}
              </option>
            )}
          />
          <AsyncSelect<NutritionistInterface>
            formik={formik}
            name={'nutritionist_id'}
            label={'Select Nutritionist'}
            placeholder={'Select Nutritionist'}
            fetcher={getNutritionists}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'meal_plan',
  operation: AccessOperationEnum.CREATE,
})(MealPlanCreatePage);
