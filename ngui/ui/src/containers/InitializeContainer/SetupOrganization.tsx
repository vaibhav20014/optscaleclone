import { Fragment } from "react";
import { useMutation } from "@apollo/client";
import { Box, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import CapabilityField from "components/CapabilityField";
import PageTitle from "components/PageTitle";
import SubmitButtonLoader from "components/SubmitButtonLoader";
import { CREATE_ORGANIZATION, UPDATE_OPTSCALE_CAPABILITY } from "graphql/api/restapi/queries/restapi.queries";

const FIELD_NAMES = Object.freeze({
  CAPABILITY: "capability",
  CAPABILITY_ML: "mlops",
  CAPABILITY_FIN: "finops"
});

type FormValues = {
  [FIELD_NAMES.CAPABILITY]: {
    [FIELD_NAMES.CAPABILITY_ML]: boolean;
    [FIELD_NAMES.CAPABILITY_FIN]: boolean;
  };
};

const getDefaultValues = (): FormValues => ({
  [FIELD_NAMES.CAPABILITY]: {
    [FIELD_NAMES.CAPABILITY_ML]: true,
    [FIELD_NAMES.CAPABILITY_FIN]: true
  }
});

type SetupOrganizationProps = {
  userEmail: string;
  refetchOrganizations: () => void;
};

const SetupOrganization = ({ userEmail, refetchOrganizations }: SetupOrganizationProps) => {
  const [createOrganization, { loading: createOrganizationLoading }] = useMutation(CREATE_ORGANIZATION);

  const [updateOptscaleCapabilityMutation, { loading: updateOptscaleCapabilityLoading }] =
    useMutation(UPDATE_OPTSCALE_CAPABILITY);

  const methods = useForm<FormValues>({
    defaultValues: getDefaultValues()
  });

  const { handleSubmit } = methods;

  const onSubmit = async (formData: FormValues) => {
    const { data } = await createOrganization({
      variables: {
        organizationName: `${userEmail}'s Organization`
      }
    });

    const organizationId = data.createOrganization.id;

    await updateOptscaleCapabilityMutation({
      variables: {
        organizationId,
        value: formData[FIELD_NAMES.CAPABILITY]
      }
    });

    await refetchOrganizations();
  };

  return (
    <>
      <Box pr={2} pl={2}>
        <PageTitle dataTestId="p_setup_title" align="center">
          <FormattedMessage id="whichOptscaleCapabilitiesAreYouLookingFor" />
        </PageTitle>
      </Box>
      <FormProvider {...methods}>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" flexDirection="column" alignItems="center" px={4}>
            <CapabilityField
              fieldNames={{
                capability: FIELD_NAMES.CAPABILITY,
                capabilityMl: FIELD_NAMES.CAPABILITY_ML,
                capabilityFin: FIELD_NAMES.CAPABILITY_FIN
              }}
            />
            <Typography align="center" variant="body1" sx={{ my: 3 }}>
              <FormattedMessage id="youCanChangeCapabilityInSettings" />
            </Typography>
            <SubmitButtonLoader
              messageId="next"
              size="medium"
              isLoading={createOrganizationLoading || updateOptscaleCapabilityLoading}
            />
          </Box>
        </form>
      </FormProvider>
    </>
  );
};

export default SetupOrganization;
