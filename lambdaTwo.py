import json
import boto3
from botocore.exceptions import ClientError

api_request_path = "/get-credentials"

def lambda_handler(event, context):
    if event['rawPath'] == api_request_path:
        
        secret_name = "arn:aws:secretsmanager:us-east-1:767152211709:secret:DemoSnapShareSecrets-WWRLkr"
        region_name = "us-east-1"
    
        session = boto3.session.Session()
        client = session.client(
            service_name='secretsmanager',
            region_name=region_name
        )

        try:
            get_secret_value_response = client.get_secret_value(
                SecretId=secret_name
            )
            secret_data = json.loads(get_secret_value_response['SecretString'])
            
        except ClientError as e:
            if e.response['Error']['Code'] == 'DecryptionFailureException':
                return {
                    "statusCode": 500,
                    "body": "Unable to fetch secret"
                }
            elif e.response['Error']['Code'] == 'InternalServiceErrorException':
                return {
                    "statusCode": 500,
                    "body": "Unable to fetch secret"
                }
            elif e.response['Error']['Code'] == 'InvalidParameterException':
                return {
                    "statusCode": 500,
                    "body": "Unable to fetch secret"
                }
            elif e.response['Error']['Code'] == 'InvalidRequestException':
                return {
                    "statusCode": 500,
                    "body": "Unable to fetch secret"
                }
            elif e.response['Error']['Code'] == 'ResourceNotFoundException':
                return {
                    "statusCode": 500,
                    "body": "Unable to fetch secret"
                }
        
        return {
            "statusCode": 200,
            "body": json.dumps({
                "secrets": secret_data
            })
        }
    else:
        return {
            "statusCode": 400,
            "body": "Invalid request"
        }
