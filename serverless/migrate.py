#!/usr/bin/env python3
"""
migrate.py — One-time migration of JSON data files → DynamoDB.
Run after deploying the stack and before cutting over DNS.

Copy auth.json from EC2 first:
  scp ec2-user@3.6.40.8:/opt/portfolio/backend/data/auth.json ./auth_backup.json

Requirements:
  pip install boto3
"""
import json
import decimal
import sys
import boto3
from pathlib import Path

REGION   = 'ap-south-1'
DATA_DIR = Path(__file__).parent.parent / 'portfolio-webapp' / 'backend' / 'data'

dynamo = boto3.resource('dynamodb', region_name=REGION)


def load_json(path: Path):
    with open(path) as f:
        return json.load(f, parse_float=decimal.Decimal)

def to_dynamo(obj):
    """Recursively convert int/float → Decimal."""
    if isinstance(obj, list):
        return [to_dynamo(i) for i in obj]
    if isinstance(obj, dict):
        return {k: to_dynamo(v) for k, v in obj.items()}
    if isinstance(obj, bool):
        return obj
    if isinstance(obj, (int, float)):
        return decimal.Decimal(str(obj))
    return obj


def migrate_profile():
    path = DATA_DIR / 'profile.json'
    data = load_json(path)
    tbl  = dynamo.Table('portfolio-profile')
    tbl.put_item(Item={'PK': 'profile', **to_dynamo(data)})
    print('✓ profile')

def migrate_list(name: str):
    path  = DATA_DIR / f'{name}.json'
    items = load_json(path)
    tbl   = dynamo.Table(f'portfolio-{name}')
    for item in items:
        tbl.put_item(Item=to_dynamo(item))
    print(f'✓ {name} ({len(items)} items)')

def migrate_auth():
    # Try local data dir first, then fall back to auth_backup.json
    path = DATA_DIR / 'auth.json'
    if not path.exists():
        path = Path(__file__).parent / 'auth_backup.json'
    if not path.exists():
        print('✗ auth.json not found. Copy from EC2:')
        print('  scp ec2-user@3.6.40.8:/opt/portfolio/backend/data/auth.json ./serverless/auth_backup.json')
        return
    data = load_json(path)
    tbl  = dynamo.Table('portfolio-auth')
    tbl.put_item(Item={'PK': 'auth', **to_dynamo(data)})
    print('✓ auth')


def main():
    print('=== Migrating JSON -> DynamoDB ===\n')
    migrate_profile()
    migrate_list('blogs')
    migrate_list('experience')
    migrate_list('ramblings')
    migrate_auth()
    print('\nMigration complete.')
    print('Run setup_admin.py instead of migrating auth if you want a fresh password + new TOTP secret.')


if __name__ == '__main__':
    main()
