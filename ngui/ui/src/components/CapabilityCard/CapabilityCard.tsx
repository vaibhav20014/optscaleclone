import { ChangeEvent } from "react";
import { Box, Typography, Paper, lighten } from "@mui/material";
import { FormattedMessage } from "react-intl";
import Checkbox from "components/Checkbox";
import ContentBackdropLoader from "components/ContentBackdropLoader";

type CapabilityCardProps = {
  capability: "mlops" | "finops";
  checked?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  isLoading?: boolean;
  disabled?: boolean;
  typographyVariant?: "body1" | "body2" | "subtitle1" | "subtitle2" | "caption" | "overline";
};

type FeatureListProps = {
  messageIds: string[];
  variant?: "body1" | "body2" | "subtitle1" | "subtitle2" | "caption" | "overline";
};

const FeatureList = ({ messageIds, variant = "body1" }: FeatureListProps) => (
  <ul style={{ margin: 0, paddingLeft: "1rem", listStyleType: "'-  '" }}>
    {messageIds.map((messageId) => (
      <li key={messageId}>
        <Typography variant={variant}>
          <FormattedMessage id={messageId} />
        </Typography>
      </li>
    ))}
  </ul>
);

const capabilityMessages = {
  mlops: [
    "capability.mlops.1",
    "capability.mlops.2",
    "capability.mlops.3",
    "capability.mlops.4",
    "capability.mlops.5",
    "capability.mlops.6"
  ],
  finops: [
    "capability.finops.1",
    "capability.finops.2",
    "capability.finops.3",
    "capability.finops.4",
    "capability.finops.5",
    "capability.finops.6"
  ]
};

const capabilityName = {
  mlops: "mlops",
  finops: "finops"
};

const CapabilityCard = ({
  capability,
  onChange,
  checked = false,
  isLoading = false,
  disabled = false,
  typographyVariant = "body2"
}: CapabilityCardProps) => (
  <ContentBackdropLoader isLoading={isLoading} size="medium">
    <Box
      sx={{
        height: "100%",
        width: "100%"
      }}
    >
      <label
        style={{
          cursor: "pointer",
          display: "flex"
        }}
      >
        <Paper
          elevation={0}
          sx={{
            border: (theme) => `1px solid ${lighten(theme.palette.info.main, 0.8)}`,
            width: "100%",
            height: "100%"
          }}
        >
          <Box
            sx={{
              padding: "1rem"
            }}
          >
            <Box
              sx={{
                ml: "-11px",
                display: "flex",
                alignItems: "center"
              }}
            >
              <Checkbox checked={checked} onChange={onChange} disabled={disabled} />
              <Typography variant={typographyVariant}>
                <FormattedMessage id={capabilityName[capability]} />
              </Typography>
            </Box>
            <Box>
              <FeatureList messageIds={capabilityMessages[capability]} variant={typographyVariant} />
            </Box>
          </Box>
        </Paper>
      </label>
    </Box>
  </ContentBackdropLoader>
);

export default CapabilityCard;
