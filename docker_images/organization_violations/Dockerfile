FROM python:3.12.3-slim

WORKDIR /usr/src/app/
ENV PYTHONPATH /usr/src/app/

COPY optscale_client/config_client optscale_client/config_client
COPY optscale_client/rest_api_client optscale_client/rest_api_client
COPY tools/optscale_time tools/optscale_time

COPY docker_images/organization_violations/requirements.txt docker_images/organization_violations/
RUN pip install --no-cache-dir -r docker_images/organization_violations/requirements.txt

COPY docker_images/organization_violations/scheduler.py docker_images/organization_violations/worker.py docker_images/organization_violations/

CMD ["python3", "docker_images/organization_violations/worker.py"]
