from flask import request, jsonify
from .normalize_data import normalize_data

def paginate_query(query, data_name, process_item_callback=None):
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    if page < 1 or per_page < 1:
        raise ValueError("Invalid page or per_page values")

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    items = []
    for item in pagination.items:
        item_dict = item.to_dict()
        if process_item_callback:
            item_dict = process_item_callback(item, item_dict)
        items.append(item_dict)

    return {
        data_name: items,
        "total_items": pagination.total,
        "total_pages": pagination.pages,
        "current_page": page
    }

