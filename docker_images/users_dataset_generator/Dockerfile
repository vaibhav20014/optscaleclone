FROM python:3.12.3-slim

WORKDIR /usr/src/app/
ENV PYTHONPATH /usr/src/app/

COPY optscale_client/config_client optscale_client/config_client
COPY tools/optscale_data tools/optscale_data

COPY docker_images/users_dataset_generator/requirements.txt docker_images/users_dataset_generator/
RUN pip install --no-cache-dir -r docker_images/users_dataset_generator/requirements.txt

COPY docker_images/users_dataset_generator/users_dataset_generator.py docker_images/users_dataset_generator/

CMD ["python3", "docker_images/users_dataset_generator/users_dataset_generator.py"]
