import logging
from datetime import datetime, timezone
from diworker.diworker.migrations.base import BaseMigration
import clickhouse_connect
from optscale_client.rest_api_client.client_v2 import Client as RestClient

"""
Traffic expenses fix for aws accounts without regions
"""

LOG = logging.getLogger(__name__)


class Migration(BaseMigration):
    @property
    def rest_cl(self):
        if self._rest_cl is None:
            self._rest_cl = RestClient(
                url=self.config_cl.restapi_url(), verify=False)
            self._rest_cl.secret = self.config_cl.cluster_secret()
        return self._rest_cl

    @property
    def mongo_raw(self):
        return self.db.raw_expenses

    def _get_clickhouse_client(self):
        user, password, host, db_name, port, secure = (
            self.config_cl.clickhouse_params())
        return clickhouse_connect.get_client(
                host=host, password=password, database=db_name, user=user,
                port=port, secure=secure
        )

    def upgrade(self):
        clickhouse_client = self._get_clickhouse_client()
        cloud_account_ids = []
        _, resp = self.rest_cl.organization_list()
        LOG.info('Collect cloud_accounts')
        for org in resp['organizations']:
            _, cloud_accs = self.rest_cl.cloud_account_list(
                org['id'], type='aws_cnr')
            cloud_account_ids.extend(
                list(map(lambda x: x['id'], cloud_accs['cloud_accounts'])))
        accs_to_fix = []
        cnt = 0
        for ca in cloud_account_ids:
            cnt += 1
            LOG.info('Check raw expenses regions for cloud account %s (%s/%s)'
                     % (ca, cnt, len(cloud_account_ids)))
            res = self.mongo_raw.find({
                'cloud_account_id': ca,
                'product/servicecode': 'AWSDataTransfer',
                'pricing/term': 'OnDemand',
                '$or': [
                    {'$and': [
                        {'product_from_region_code': {'$ne': None}},
                        {'product/fromRegionCode': None}
                    ]},
                    {'$and': [
                        {'product_to_region_code': {'$ne': None}},
                        {'product/toRegionCode': None}
                    ]}
                ]
            }).limit(1)
            for r in res:
                accs_to_fix.append(ca)
        LOG.info('Found %s accounts to fix: %s' % (
            len(accs_to_fix), accs_to_fix))

        if accs_to_fix:
            LOG.info('Drop traffic expenses')
            clickhouse_client.query(
                """
                    ALTER TABLE traffic_expenses
                    DELETE
                    WHERE cloud_account_id in %(cloud_accounts)s
                """, parameters={'cloud_accounts': accs_to_fix}
            )
            clickhouse_client.query('OPTIMIZE TABLE traffic_expenses FINAL')
        now = int(datetime.now(tz=timezone.utc).timestamp())
        for ca in accs_to_fix:
            LOG.info('Create traffic processing task for %s' % ca)
            self.rest_cl.traffic_processing_task_create(ca, {
                'start_date': 0, 'end_date': now
            })
        LOG.info('Completed')

    def downgrade(self):
        pass
