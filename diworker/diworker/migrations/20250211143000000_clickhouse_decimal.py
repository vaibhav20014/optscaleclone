import logging
from datetime import datetime
from diworker.diworker.migrations.base import BaseMigration
from clickhouse_driver import Client as ClickHouseClient

"""
Changing clickhouse cost type to decimal
"""
LOG = logging.getLogger(__name__)
COST_TYPE_MAP = {
    'expenses': ['cost'],
    'traffic_expenses': ['cost', 'usage']
}
OLD_TYPE = 'Float(64)'
NEW_TYPE = 'Decimal64(12)'


class Migration(BaseMigration):

    def _get_clickhouse_client(self):
        user, password, host, db_name = self.config_cl.clickhouse_params()
        return ClickHouseClient(
            host=host, password=password, database=db_name, user=user)

    def upgrade(self):
        self._set_type(NEW_TYPE)

    def downgrade(self):
        self._set_type(OLD_TYPE)

    def _set_type(self, _type):
        clickhouse_client = self._get_clickhouse_client()
        for db, fields in COST_TYPE_MAP.items():
            st_start = datetime.now()
            for f in fields:
                clickhouse_client.execute(
                    f'ALTER TABLE {db} MODIFY COLUMN {f} {_type}')
            LOG.info(f'Table {db} migrated in %s' % (
                    datetime.now() - st_start).total_seconds())
