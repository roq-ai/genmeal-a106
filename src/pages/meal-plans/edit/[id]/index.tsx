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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getMealPlanById, updateMealPlanById } from 'apiSdk/meal-plans';
import { Error } from 'components/error';
import { mealPlanValidationSchema } from 'validationSchema/meal-plans';
import { MealPlanInterface } from 'interfaces/meal-plan';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ClientInterface } from 'interfaces/client';
import { NutritionistInterface } from 'interfaces/nutritionist';
import { getClients } from 'apiSdk/clients';
import { getNutritionists } from 'apiSdk/nutritionists';

function MealPlanEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<MealPlanInterface>(
    () => (id ? `/meal-plans/${id}` : null),
    () => getMealPlanById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: MealPlanInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateMealPlanById(id, values);
      mutate(updated);
      resetForm();
      router.push('/meal-plans');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<MealPlanInterface>({
    initialValues: data,
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
            Edit Meal Plan
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'meal_plan',
  operation: AccessOperationEnum.UPDATE,
})(MealPlanEditPage);
