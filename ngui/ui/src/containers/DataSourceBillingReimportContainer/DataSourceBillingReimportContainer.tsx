import { useMutation } from "@apollo/client";
import DataSourceBillingReimportForm from "components/forms/DataSourceBillingReimportForm/DataSourceBillingReimportForm";
import { GET_DATA_SOURCE, UPDATE_DATA_SOURCE } from "graphql/api/restapi/queries/restapi.queries";
import { millisecondsToSeconds } from "utils/datetime";

type DataSourceBillingReimportContainerProps = {
  dataSourceId: string;
  onSuccess: () => void;
};

const DataSourceBillingReimportContainer = ({ dataSourceId, onSuccess }: DataSourceBillingReimportContainerProps) => {
  const [updateDataSource, { loading }] = useMutation(UPDATE_DATA_SOURCE);

  return (
    <DataSourceBillingReimportForm
      onSubmit={(formData) =>
        updateDataSource({
          variables: {
            dataSourceId,
            params: {
              lastImportAt: millisecondsToSeconds(formData.importFrom),
              lastImportModifiedAt: millisecondsToSeconds(formData.importFrom)
            }
          },
          refetchQueries: [GET_DATA_SOURCE]
        }).then(onSuccess)
      }
      isSubmitLoading={loading}
    />
  );
};

export default DataSourceBillingReimportContainer;
