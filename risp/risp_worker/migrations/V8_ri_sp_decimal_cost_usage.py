import logging
from datetime import datetime
from risp.risp_worker.migrations.base import MigrationBase

LOG = logging.getLogger(__name__)
COST_TYPE_MAP = {
    'uncovered_usage': ['cost', 'usage'],
    'ri_sp_usage': ['offer_cost', 'on_demand_cost', 'expected_cost', 'usage',
                    'ri_norm_factor', 'sp_rate']
}
NEW_TYPE = 'Decimal64(12)'


class Migration(MigrationBase):
    def upgrade(self):
        for db, fields in COST_TYPE_MAP.items():
            st_start = datetime.now()
            for f in fields:
                self.clickhouse_client.execute(
                    f'ALTER TABLE {db} MODIFY COLUMN {f} {NEW_TYPE}')
            LOG.info(f'Table {db} migrated in %s' % (
                    datetime.now() - st_start).total_seconds())
