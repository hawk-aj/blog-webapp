#!/usr/bin/env python3
"""
setup_admin.py — Initialise admin credentials in DynamoDB.
Run this once after deploying the CloudFormation stack.

Requirements (install locally, not in the Lambda zip):
  pip install bcrypt pyotp qrcode[pil] boto3
"""
import sys
import getpass
import boto3
import bcrypt
import pyotp
import qrcode

REGION = 'ap-south-1'
TABLE  = 'portfolio-auth'


def main():
    print('=== Portfolio Admin Setup ===\n')

    password = getpass.getpass('Set admin password: ')
    confirm  = getpass.getpass('Confirm password: ')
    if password != confirm:
        print('Passwords do not match.')
        sys.exit(1)
    if len(password) < 8:
        print('Password must be at least 8 characters.')
        sys.exit(1)

    password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    totp_secret   = pyotp.random_base32()
    totp_uri      = pyotp.TOTP(totp_secret).provisioning_uri(
        name='Admin', issuer_name='aaryajha.com'
    )

    print(f'\nTOTP Secret: {totp_secret}')
    print('\nScan this QR code with Google Authenticator / Authy:\n')
    qr = qrcode.QRCode()
    qr.add_data(totp_uri)
    qr.make(fit=True)
    qr.print_ascii(invert=True)

    input('\nPress Enter after scanning the QR code...')

    dynamo = boto3.resource('dynamodb', region_name=REGION)
    table  = dynamo.Table(TABLE)
    table.put_item(Item={
        'PK':            'auth',
        'password_hash': password_hash,
        'totp_secret':   totp_secret,
    })

    print(f'\nCredentials saved to DynamoDB table: {TABLE}')
    print('You can now log in at https://aaryajha.com/admin\n')


if __name__ == '__main__':
    main()
