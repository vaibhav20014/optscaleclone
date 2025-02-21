import { ReactNode } from "react";

type IconLabelProps = {
  label: ReactNode;
  icon?: ReactNode;
  endIcon?: ReactNode;
  alignItems?: string;
};

const IconLabel = ({ icon: startIcon, endIcon, label, alignItems = "center" }: IconLabelProps) => (
  <div style={{ display: "inline-flex", verticalAlign: "middle", alignItems }}>
    {startIcon && <>{startIcon}&nbsp;</>}
    {label}
    {endIcon && <>&nbsp;{endIcon}</>}
  </div>
);

export default IconLabel;
