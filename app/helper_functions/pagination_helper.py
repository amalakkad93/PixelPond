from flask import request, jsonify
from .normalize_data import normalize_data

def paginate_query(query, data_name):
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    if page < 1 or per_page < 1:
        raise ValueError("Invalid page or per_page values")

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    items = [item.to_dict() for item in pagination.items]
    # normalize_data_items = normalize_data(items, 'id')
    return {
        # "posts": normalize_data_items,
        "items": items,
        "total_items": pagination.total,
        "total_pages": pagination.pages,
        "current_page": page
    }
