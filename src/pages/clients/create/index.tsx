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
import { createClient } from 'apiSdk/clients';
import { Error } from 'components/error';
import { clientValidationSchema } from 'validationSchema/clients';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { ClientInterface } from 'interfaces/client';

function ClientCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ClientInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createClient(values);
      resetForm();
      router.push('/clients');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ClientInterface>({
    initialValues: {
      location: '',
      daily_calorie_intake: 0,
      cultural_preferences: '',
      user_id: (router.query.user_id as string) ?? null,
    },
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
            Create Client
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'client',
  operation: AccessOperationEnum.CREATE,
})(ClientCreatePage);
