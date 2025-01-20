import { Box } from "@mui/material";
import { FormControl, FormHelperText } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";
import CapabilityCard from "components/CapabilityCard";
import { FIELD_NAMES } from "../constants";
import { FormValues } from "../types";

const CapabilityField = () => {
  const intl = useIntl();
  const {
    control,
    formState: { errors }
  } = useFormContext<FormValues>();

  return (
    <FormControl margin="none">
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
              onChange={(checked) => {
                onChange({ ...value, [FIELD_NAMES.CAPABILITY_FIN]: checked });
              }}
            />
            <CapabilityCard
              capability="mlops"
              checked={value[FIELD_NAMES.CAPABILITY_ML]}
              onChange={(checked) => {
                onChange({ ...value, [FIELD_NAMES.CAPABILITY_ML]: checked });
              }}
            />
          </Box>
        )}
      />
      {!!errors[FIELD_NAMES.CAPABILITY] && <FormHelperText error>{errors[FIELD_NAMES.CAPABILITY]?.message}</FormHelperText>}
    </FormControl>
  );
};

export default CapabilityField;
