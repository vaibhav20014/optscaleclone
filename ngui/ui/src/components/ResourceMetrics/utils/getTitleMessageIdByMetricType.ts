import { METRIC_TYPES } from "utils/constants";

const getTitleMessageIdByMetricType = (metricType: string) =>
  (
    ({
      [METRIC_TYPES.CPU]: "cpu",
      [METRIC_TYPES.MEMORY]: "memory",
      [METRIC_TYPES.DISK_IO]: "diskIO",
      [METRIC_TYPES.NETWORK]: "network",
      [METRIC_TYPES.BYTES_SENT]: "bytesSent",
      [METRIC_TYPES.PACKETS_SENT]: "packetsSent"
    }) as const
  )[metricType];

export default getTitleMessageIdByMetricType;
