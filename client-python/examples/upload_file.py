# coding: utf-8

import datetime
from pycti import OpenCTIApiClient

# Variables
api_url = "https://demo.opencti.io"
api_token = "2b4f29e3-5ea8-4890-8cf5-a76f61f1e2b2"

# OpenCTI initialization
opencti_api_client = OpenCTIApiClient(api_url, api_token)

# Upload the file
file = opencti_api_client.upload_file(file_name="./file.pdf",)
print(file)
