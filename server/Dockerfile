FROM python:3.12-slim-bookworm

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV APP=/app

WORKDIR $APP

COPY requirements.txt $APP
RUN pip3 install -r requirements.txt && pip3 install requests

COPY . $APP

EXPOSE 8000

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"]
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
