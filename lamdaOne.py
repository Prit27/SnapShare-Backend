"""
Application: SnapShare - CSCI 5409
A lambda function: image2pdf-lambda

Written in: Python 3.8
Configuration in AWS:
    Step 1: Select Author from Scratch option
    Step 2: Write function name and select Python 3.8 as runtime
    Step 3: Keep architecture x86_64
    Step 4: Keep everything as default and create function
    Step 5: Click on 'Layers' and then Add Layer option
    Step 6: Inside add layer window, select option 'Specify an ARN' under choose layer option
    Step 7: Paste the string: 'arn:aws:lambda:us-east-1:770693421928:layer:Klayers-p38-Pillow:1'
            Reference: https://api.klayers.cloud//api/v2/p3.8/layers/latest/us-east-1/html
            This will add 'pillow' library to AWS Lambda dependencies list
    Step 8: Click on 'Add' button to add the layer
    (optional)
    Step 9: Allow public access to both buckets (if proper IAM is not given and generalized IAM policy
            is created while creation of lambda function)
    Step 10: If not added, add reading and writing policies to both buckets as below
            {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Sid": "AllowS3Access",
                        "Effect": "Allow",
                        "Principal": {
                            "AWS": "<arn of this lambda function>"
                        },
                        "Action": "s3:*",
                        "Resource": [
                            "arn:aws:s3:::<Bucket-Name>",
                            "arn:aws:s3:::<Bucket-Name>/*"
                        ]
                    }
                ]
            }

Function trigger: S3 Bucket (in this project, img2pdf-image-storage)

AWS Resource Requirements:
    1. S3 Bucket (demo-snapshare-image-s3-bucket): image trigger - to fetch image
    2. S3 Bucket (demo-snapshare-pdf-s3-bucket): save pdf after conversion - to save pdf

Description: An AWS lambda function which triggers when any object is being uploaded
             to the S3 Bucket 'img2pdf-image-storage'. It copies the file to local
             environment and converts that image to PDF file. That PDF file is being
             uploaded to another S3 Bucket 'img2pdf-pdf-storage'.

             Returns: Success with 'Status 200'

Important Files:
    1. lambda_function.py - A main python program, executes as a python lambda function
    2. lambda_handler - A method being executed in the file lambda_function.py

Dependencies: Refer requirements.txt (pip install requirements.txt)
    1. 'json' - A json file parser and format converter (https://docs.python.org/3/library/json.html)
    2. 'boto3' - An AWS SDK for python (https://boto3.amazonaws.com/v1/documentation/api/latest/guide/quickstart.html)
    3. 'urllib' - A package that collects several modules for working with URLs (https://docs.python.org/3/library/urllib.html)
    4. 'pillow' - Also described as 'PIL' - A python image processing library (https://pillow.readthedocs.io/en/stable/)

To run the application: As this is lambda function, this file with dependencies will run on AWS lambda

NOTE: It assumes that the uploaded object is an image file.
"""

import json
import boto3
import urllib
from PIL import Image


def lambda_handler(event, context):
    s3 = boto3.resource('s3')

    bucket_name = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']
    key = urllib.parse.unquote_plus(key, encoding='utf-8')

    message = "Hello, this file has been uploaded, " + key + " to bucket: " + bucket_name
    print(message)

    s3.meta.client.download_file(bucket_name, key, '/tmp/image_file.png')

    print("Got image in temp, successfully")

    temp_image = Image.open(r'/tmp/image_file.png').convert('RGB')
    temp_image.save(r'/tmp/converted_document.pdf')

    upload_bucket = "demo-snapshare-pdf-s3-bucket"
    s3.Bucket(upload_bucket).upload_file("/tmp/converted_document.pdf", "uploaded_document.pdf")
    print("PDF Has been saved to Bucket")

    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }