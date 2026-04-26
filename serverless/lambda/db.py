"""
db.py — DynamoDB helpers replacing the JSON file I/O from the Flask backend.
All five tables: profile, blogs, experience, ramblings, auth.
"""
import os
import decimal
import boto3

_dynamodb = None

def _get_dynamodb():
    global _dynamodb
    if _dynamodb is None:
        _dynamodb = boto3.resource(
            'dynamodb',
            region_name=os.environ.get('DYNAMODB_REGION', 'ap-south-1'),
        )
    return _dynamodb

def _table(name):
    return _get_dynamodb().Table(f'portfolio-{name}')


# ── Single-item tables (profile) ──────────────────────────────────────────────

def load_single(name: str) -> dict:
    resp = _table(name).get_item(Key={'PK': name})
    item = dict(resp.get('Item', {}))
    item.pop('PK', None)
    return _to_python(item)

def save_single(name: str, data: dict):
    clean = {k: v for k, v in data.items() if v is not None}
    _table(name).put_item(Item={'PK': name, **_to_dynamo(clean)})


# ── Auth table ────────────────────────────────────────────────────────────────

def load_auth() -> dict:
    resp = _table('auth').get_item(Key={'PK': 'auth'})
    item = dict(resp.get('Item', {}))
    item.pop('PK', None)
    return _to_python(item)

def save_auth(data: dict):
    clean = {k: v for k, v in data.items() if v is not None}
    _table('auth').put_item(Item={'PK': 'auth', **_to_dynamo(clean)})


# ── List tables (blogs, experience, ramblings) ────────────────────────────────

def load_list(name: str, reverse: bool = False) -> list:
    resp  = _table(name).scan()
    items = [_to_python(i) for i in resp.get('Items', [])]
    return sorted(items, key=lambda x: x.get('id', 0), reverse=reverse)

def save_item(name: str, item: dict):
    _table(name).put_item(Item=_to_dynamo(item))

def delete_item(name: str, item_id: int):
    _table(name).delete_item(Key={'id': decimal.Decimal(str(item_id))})

def next_id(items: list) -> int:
    return max((i['id'] for i in items), default=0) + 1


# ── Type conversion ───────────────────────────────────────────────────────────

def _to_python(obj):
    """Recursively convert DynamoDB Decimal → int/float for JSON."""
    if isinstance(obj, list):
        return [_to_python(i) for i in obj]
    if isinstance(obj, dict):
        return {k: _to_python(v) for k, v in obj.items()}
    if isinstance(obj, decimal.Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    return obj

def _to_dynamo(obj):
    """Recursively convert int/float → Decimal for DynamoDB storage."""
    if isinstance(obj, list):
        return [_to_dynamo(i) for i in obj]
    if isinstance(obj, dict):
        return {k: _to_dynamo(v) for k, v in obj.items()}
    if isinstance(obj, bool):
        return obj  # bool before int check — bool is subclass of int
    if isinstance(obj, (int, float)):
        return decimal.Decimal(str(obj))
    return obj
