FROM gunthercox/ocr-service as ocr-img

RUN pip install -U flask-cors
COPY ./conf/api.py /code/app/api.py