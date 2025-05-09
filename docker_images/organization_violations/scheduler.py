import logging
import os
from kombu import Connection as QConnection, Exchange
from kombu.pools import producers

from optscale_client.config_client.client import Client as ConfigClient
from optscale_client.rest_api_client.client_v2 import Client as RestClient
from tools.optscale_time import utcnow


LOG = logging.getLogger(__name__)
RETRY_POLICY = {'max_retries': 15, 'interval_start': 0,
                'interval_step': 1, 'interval_max': 3}


def publish_tasks(org_ids, config_cl):
    now = int(utcnow().timestamp())
    queue_conn = QConnection('amqp://{user}:{pass}@{host}:{port}'.format(
        **config_cl.read_branch('/rabbit')),
        transport_options=RETRY_POLICY)
    task_exchange = Exchange('organization-violations', type='direct')
    with producers[queue_conn].acquire(block=True) as producer:
        for org_id in org_ids:
            task_params = {
                'organization_id': org_id,
                'date': now,
                'notifications': True
            }
            producer.publish(
                task_params,
                serializer='json',
                exchange=task_exchange,
                declare=[task_exchange],
                routing_key='organization-violation',
                retry=True,
                retry_policy=RETRY_POLICY
            )
            LOG.info('Task published for org %s', org_id)


def get_org_ids(config_cl):
    rest_cl = RestClient(url=config_cl.restapi_url(),
                         secret=config_cl.cluster_secret(), verify=False)
    _, response = rest_cl.organization_list(
        {'with_connected_accounts': True, 'disabled': False})
    return [org['id'] for org in response['organizations']]


def main(config_cl):
    org_ids = get_org_ids(config_cl)
    LOG.info('Publishing tasks for orgs: %s', org_ids)
    publish_tasks(org_ids, config_cl)


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    config_cl = ConfigClient(
        host=os.environ.get('HX_ETCD_HOST'),
        port=int(os.environ.get('HX_ETCD_PORT')),
    )
    config_cl.wait_configured()
    main(config_cl)
