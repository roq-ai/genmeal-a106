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
import { getClientById, updateClientById } from 'apiSdk/clients';
import { Error } from 'components/error';
import { clientValidationSchema } from 'validationSchema/clients';
import { ClientInterface } from 'interfaces/client';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function ClientEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ClientInterface>(
    () => (id ? `/clients/${id}` : null),
    () => getClientById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ClientInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateClientById(id, values);
      mutate(updated);
      resetForm();
      router.push('/clients');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ClientInterface>({
    initialValues: data,
    validationSchema: clientValidationSchema,
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
            Edit Client
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
            <FormControl id="location" mb="4" isInvalid={!!formik.errors?.location}>
              <FormLabel>Location</FormLabel>
              <Input type="text" name="location" value={formik.values?.location} onChange={formik.handleChange} />
              {formik.errors.location && <FormErrorMessage>{formik.errors?.location}</FormErrorMessage>}
            </FormControl>
            <FormControl id="daily_calorie_intake" mb="4" isInvalid={!!formik.errors?.daily_calorie_intake}>
              <FormLabel>Daily Calorie Intake</FormLabel>
              <NumberInput
                name="daily_calorie_intake"
                value={formik.values?.daily_calorie_intake}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('daily_calorie_intake', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.daily_calorie_intake && (
                <FormErrorMessage>{formik.errors?.daily_calorie_intake}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl id="cultural_preferences" mb="4" isInvalid={!!formik.errors?.cultural_preferences}>
              <FormLabel>Cultural Preferences</FormLabel>
              <Input
                type="text"
                name="cultural_preferences"
                value={formik.values?.cultural_preferences}
                onChange={formik.handleChange}
              />
              {formik.errors.cultural_preferences && (
                <FormErrorMessage>{formik.errors?.cultural_preferences}</FormErrorMessage>
              )}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
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
  entity: 'client',
  operation: AccessOperationEnum.UPDATE,
})(ClientEditPage);
