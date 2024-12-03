import BaseClient from "../baseClient.js";
import {
  DataSourceRequestParams,
  MutationUpdateEmployeeEmailsArgs,
  UpdateDataSourceInput,
  MutationUpdateEmployeeEmailArgs,
} from "../../graphql/resolvers/restapi.generated.js";

class RestClient extends BaseClient {
  override baseURL = `${
    process.env.REST_ENDPOINT || this.endpoint
  }/restapi/v2/`;

  async getDataSource(
    dataSourceId: string,
    requestParams: DataSourceRequestParams
  ) {
    const path = `cloud_accounts/${dataSourceId}?details=${requestParams.details}`;

    const dataSource = await this.get(path);

    return dataSource;
  }

  async updateDataSource(dataSourceId, params: UpdateDataSourceInput) {
    const path = `cloud_accounts/${dataSourceId}`;

    const dataSource = await this.patch(path, {
      body: JSON.stringify({
        name: params.name,
        last_import_at: params.lastImportAt,
        last_import_modified_at: params.lastImportModifiedAt,
        config: {
          ...params.awsRootConfig,
          ...params.awsLinkedConfig,
          ...params.azureSubscriptionConfig,
          ...params.azureTenantConfig,
          ...params.gcpConfig,
          ...params.alibabaConfig,
          ...params.nebiusConfig,
          ...params.databricksConfig,
          ...params.k8sConfig,
        },
      }),
    });

    return dataSource;
  }

  async getEmployeeEmails(employeeId: string) {
    const path = `employees/${employeeId}/emails`;

    const emails = await this.get(path);

    return emails.employee_emails;
  }

  async updateEmployeeEmails(
    employeeId: MutationUpdateEmployeeEmailsArgs["employeeId"],
    params: MutationUpdateEmployeeEmailsArgs["params"]
  ) {
    const path = `employees/${employeeId}/emails/bulk`;

    const emails = await this.post(path, {
      body: params,
    });

    const emailIds = [...(params?.enable ?? []), ...(params.disable ?? [])];

    return emails.employee_emails.filter((email) =>
      emailIds.includes(email.id)
    );
  }

  async updateEmployeeEmail(
    employeeId: MutationUpdateEmployeeEmailArgs["employeeId"],
    params: MutationUpdateEmployeeEmailArgs["params"]
  ) {
    const { emailId, action } = params;

    const path = `employees/${employeeId}/emails/bulk`;

    const emails = await this.post(path, {
      body: {
        [action === "enable" ? "enable" : "disable"]: [emailId],
      },
    });

    const email = emails.employee_emails.find((email) => email.id === emailId);

    return email;
  }
}

export default RestClient;
