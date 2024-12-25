import { Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import ButtonLoader from "components/ButtonLoader";
import FormButtonsWrapper from "components/FormButtonsWrapper";
import EmployeesService from "services/EmployeesService";
import PoolsService from "services/PoolsService";
import { isOrganizationManager, isPoolManager } from "utils/employees";
import { NameField, LimitField, TypeSelector, AutoExtendCheckbox, OwnerSelector } from "./FormElements";
import { CreatePoolFormProps, CreatePoolFormValues } from "./types";
import { getCreateFormDefaultValues } from "./utils";

const CreatePoolForm = ({ parentId, onSuccess, unallocatedLimit }: CreatePoolFormProps) => {
  const { useCreatePool } = PoolsService();
  const { isLoading: isCreatePoolLoading, createPool } = useCreatePool();

  const { useGet: useGetEmployees } = EmployeesService();

  const { isLoading: isGetEmployeesLoading, employees } = useGetEmployees();

  const owners = employees.filter((employee) => isOrganizationManager(employee) || isPoolManager(employee, parentId));

  const methods = useForm<CreatePoolFormValues>({
    defaultValues: getCreateFormDefaultValues()
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit((formValues) => createPool({ ...formValues, parentId }).then(onSuccess));

  return (
    <FormProvider {...methods}>
      <form data-test-id="form_add_pool" onSubmit={onSubmit} noValidate>
        <NameField />
        <TypeSelector />
        <OwnerSelector isLoading={isGetEmployeesLoading} owners={owners} helpMessageId="createPoolDefaultOwnerHelp" />
        <LimitField unallocatedLimit={unallocatedLimit} />
        <AutoExtendCheckbox />
        <FormButtonsWrapper justifyContent="space-between">
          <Box display="flex">
            <ButtonLoader
              variant="contained"
              messageId="create"
              color="primary"
              type="submit"
              isLoading={isCreatePoolLoading}
              dataTestId="btn_create"
            />
          </Box>
        </FormButtonsWrapper>
      </form>
    </FormProvider>
  );
};

export default CreatePoolForm;
