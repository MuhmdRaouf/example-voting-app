FROM python:3.10-alpine

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_VERSION=1.1.13 \
    BUILD_PACKAGES='alpine-sdk linux-headers libffi-dev'

RUN apk update && \
    apk upgrade && \
    apk add --no-cache --virtual .build-deps $BUILD_PACKAGES && \
    rm -rf /var/cache/apk/*

RUN pip install "poetry==$POETRY_VERSION"

# Set the application directory
WORKDIR /app

COPY ["poetry.lock", "pyproject.toml", "./"]

RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi

COPY [".", "."]

EXPOSE 80

CMD ["gunicorn", "app:app", "-b", "0.0.0.0:80", "--log-file", "-", "--access-logfile", "-", "--workers", "4", "--keep-alive", "0"]
