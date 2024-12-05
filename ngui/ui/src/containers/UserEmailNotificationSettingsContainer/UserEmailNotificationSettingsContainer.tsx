import { useQuery } from "@apollo/client";
import { GET_CURRENT_EMPLOYEE } from "api/restapi/actionTypes";
import UserEmailNotificationSettings from "components/UserEmailNotificationSettings";
import { GET_EMPLOYEE_EMAILS } from "graphql/api/restapi/queries/restapi.queries";
import { useApiData } from "hooks/useApiData";

const UserEmailNotificationSettingsContainer = () => {
  const {
    apiData: { currentEmployee = {} }
  } = useApiData(GET_CURRENT_EMPLOYEE);

  const { loading, data } = useQuery(GET_EMPLOYEE_EMAILS, {
    variables: {
      employeeId: currentEmployee.id
    }
  });

  return <UserEmailNotificationSettings employeeEmails={data?.employeeEmails ?? []} isLoading={loading} />;
};

export default UserEmailNotificationSettingsContainer;
