FROM python:3.12.3-slim
LABEL org.opencontainers.image.authors="Hystax"

WORKDIR /usr/src/app/
ENV PYTHONPATH=/usr/src/app/

COPY tools/optscale_exceptions tools/optscale_exceptions
COPY optscale_client/config_client optscale_client/config_client
COPY optscale_client/rest_api_client optscale_client/rest_api_client

ADD risp/risp_worker/migrations risp/risp_worker/migrations
COPY risp/risp_worker/requirements.txt risp/risp_worker/requirements.txt
RUN pip install --no-cache-dir -r risp/risp_worker/requirements.txt
COPY risp/__init__.py ./risp/
COPY risp/risp_worker/*.py ./risp/risp_worker/

CMD ["python", "-u", "/usr/src/app/risp/risp_worker/worker.py"]
