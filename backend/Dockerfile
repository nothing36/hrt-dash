FROM python:3.11-slim
WORKDIR /app

# install requirements + pytorch
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt \
    -f https://download.pytorch.org/whl/torch_stable.html

# copy weights + FastAPI
COPY app ./app
COPY weights ./weights
EXPOSE 8000

# run the service with uvicorn
CMD ["uvicorn", "app.service:app", "--host", "0.0.0.0", "--port", "8000"]