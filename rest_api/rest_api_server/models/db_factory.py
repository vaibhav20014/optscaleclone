from enum import Enum
import logging

from tools.optscale_exceptions.common_exc import InvalidModelTypeException
from rest_api.rest_api_server.exceptions import Err
from rest_api.rest_api_server.models.db_test import TestDB
from rest_api.rest_api_server.models.db_mysql import MySQLDB
from rest_api.rest_api_server.models.db_base import BaseDB


class DBType(Enum):
    Test = "test"
    MySQL = "mysql"


LOG = logging.getLogger(__name__)


class DBFactory(object):
    _db: BaseDB
    DBS = {
        DBType.Test: TestDB,
        DBType.MySQL: MySQLDB
    }
    _instances = {}

    @staticmethod
    def _get_db(db_type, config):
        db_class = DBFactory.DBS.get(db_type)
        if not db_class:
            LOG.error('Nonexistent model type specified: %s', db_type)
            raise InvalidModelTypeException(Err.OE0128, [db_type])
        else:
            return db_class(config)

    def __new__(cls, db_type, config=None, *args, **kwargs):
        if db_type not in cls._instances:
            instance = super().__new__(cls, *args, **kwargs)
            instance._db = DBFactory._get_db(db_type, config)
            cls._instances[db_type] = instance
        return cls._instances[db_type]

    @classmethod
    def clean_type(cls, db_type):
        if cls._instances.get(db_type):
            del cls._instances[db_type]

    @property
    def db(self):
        return self._db
