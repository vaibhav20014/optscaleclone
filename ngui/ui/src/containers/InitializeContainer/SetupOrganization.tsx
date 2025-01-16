import { Fragment } from "react";
import { useMutation } from "@apollo/client";
import { Box, FormControl, FormHelperText, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import CapabilityCard from "components/CapabilityCard";
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

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = methods;

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

  const intl = useIntl();

  return (
    <>
      <Box pr={2} pl={2}>
        <PageTitle dataTestId="p_setup_title" align="center">
          <FormattedMessage id="whichOptscaleCapabilitiesAreYouLookingFor" />
        </PageTitle>
      </Box>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" flexDirection="column" alignItems="center" px={4}>
          <FormControl>
            <Controller
              control={control}
              name={FIELD_NAMES.CAPABILITY}
              rules={{
                validate: {
                  atLeastOne: (value) => {
                    if (value[FIELD_NAMES.CAPABILITY_ML] || value[FIELD_NAMES.CAPABILITY_FIN]) {
                      return true;
                    }
                    return intl.formatMessage({ id: "applyOptscaleCapabilityError" });
                  }
                }
              }}
              render={({ field: { value, onChange } }) => (
                <Box
                  display="grid"
                  gridTemplateColumns={{
                    xs: "1fr",
                    sm: "repeat(2, 1fr)"
                  }}
                  columnGap={4}
                  rowGap={2}
                >
                  <CapabilityCard
                    capability="finops"
                    checked={value[FIELD_NAMES.CAPABILITY_FIN]}
                    onChange={(_, checked) => {
                      onChange({ ...value, [FIELD_NAMES.CAPABILITY_FIN]: checked });
                    }}
                    typographyVariant="body1"
                  />
                  <CapabilityCard
                    capability="mlops"
                    checked={value[FIELD_NAMES.CAPABILITY_ML]}
                    onChange={(_, checked) => {
                      onChange({ ...value, [FIELD_NAMES.CAPABILITY_ML]: checked });
                    }}
                    typographyVariant="body1"
                  />
                </Box>
              )}
            />
            {!!errors[FIELD_NAMES.CAPABILITY] && (
              <FormHelperText error>{errors[FIELD_NAMES.CAPABILITY]?.message}</FormHelperText>
            )}
          </FormControl>
          <Typography align="center" variant="body1" sx={{ mb: 6 }}>
            <FormattedMessage id="youCanChangeCapabilityInSettings" />
          </Typography>
          <SubmitButtonLoader
            messageId="next"
            size="medium"
            isLoading={createOrganizationLoading || updateOptscaleCapabilityLoading}
          />
        </Box>
      </form>
    </>
  );
};

export default SetupOrganization;
