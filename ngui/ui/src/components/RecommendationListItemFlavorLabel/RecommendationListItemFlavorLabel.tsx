import CloudTypeIcon from "components/CloudTypeIcon";
import IconLabel from "components/IconLabel";

const RecommendationListItemFlavorLabel = ({ item }) => {
  return (
    <IconLabel icon={<CloudTypeIcon fontSize="small" type={item.cloud_type} />} label={item.flavor} alignItems="flex-start" />
  );
};

export default RecommendationListItemFlavorLabel;
