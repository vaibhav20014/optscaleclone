FROM python:3.12.3-slim
LABEL org.opencontainers.image.authors="Hystax"

WORKDIR /usr/src/app/
ENV PYTHONPATH /usr/src/app/

COPY optscale_client/herald_client optscale_client/herald_client
COPY optscale_client/config_client optscale_client/config_client
COPY optscale_client/metroculus_client optscale_client/metroculus_client
COPY optscale_client/insider_client optscale_client/insider_client
COPY optscale_client/rest_api_client optscale_client/rest_api_client
COPY tools/cloud_adapter tools/cloud_adapter
COPY tools/optscale_time tools/optscale_time
COPY tools/optscale_data tools/optscale_data

COPY bumiworker/requirements.txt ./bumiworker/requirements.txt
RUN pip install --no-cache-dir -r bumiworker/requirements.txt
COPY bumiworker/bumiworker/modules ./bumiworker/bumiworker/modules
COPY bumiworker/bumiworker/*.py ./bumiworker/bumiworker/
COPY bumiworker/*.py ./bumiworker/

CMD ["python", "-u","/usr/src/app/bumiworker/bumiworker/main.py"]
