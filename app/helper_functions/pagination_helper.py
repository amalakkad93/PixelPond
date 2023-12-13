from flask import request, jsonify
from sqlalchemy.orm.query import Query
from icecream import ic

# def paginate_query(query, data_name, process_item_callback=None):
#     page = request.args.get('page', 1, type=int)
#     per_page = request.args.get('per_page', 10, type=int)

#     if page < 1 or per_page < 1:
#         raise ValueError("Invalid page or per_page values")

#     pagination = query.paginate(page=page, per_page=per_page, error_out=False)
#     items = []
#     for item in pagination.items:
#         item_dict = item.to_dict()
#         if process_item_callback:
#             item_dict = process_item_callback(item, item_dict)
#         items.append(item_dict)

#     return {
#         data_name: items,
#         "total_items": pagination.total,
#         "total_pages": pagination.pages,
#         "current_page": page
#     }


def paginate_query(query_or_list, data_name, process_item_callback=None, is_list=False):
    ic(query_or_list)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    if page < 1 or per_page < 1:
        raise ValueError("Invalid page or per_page values")

    if is_list:
        start = (page - 1) * per_page
        end = start + per_page
        items = query_or_list[start:end]
        total = len(query_or_list)
    else:
        pagination = query_or_list.paginate(page=page, per_page=per_page, error_out=False)
        items = pagination.items
        total = pagination.total

    total_pages = (total + per_page - 1) // per_page
    if page > total_pages:
        return {
            data_name: [],
            "total_items": total,
            "total_pages": total_pages,
            "current_page": page
        }

    processed_items = []
    for item in items:
        item_dict = item if is_list else item.to_dict()
        if process_item_callback:
            item_dict = process_item_callback(item, item_dict)
        processed_items.append(item_dict)

    return {
        data_name: processed_items,
        "total_items": total,
        "total_pages": total_pages,
        "current_page": page
    }

# def paginate_query(query_or_list, data_name, process_item_callback=None, is_list=False):
#     ic(query_or_list)
#     page = request.args.get('page', 1, type=int)
#     per_page = request.args.get('per_page', 10, type=int)

#     if page < 1 or per_page < 1:
#         raise ValueError("Invalid page or per_page values")

#     if is_list:  # If the input is a list
#         start = (page - 1) * per_page
#         end = start + per_page
#         items = query_or_list[start:end]
#         total = len(query_or_list)
#     else:  # If the input is a query
#         pagination = query_or_list.paginate(page=page, per_page=per_page, error_out=False)
#         items = pagination.items
#         total = pagination.total

#     processed_items = []
#     for item in items:
#         item_dict = item if is_list else item.to_dict()
#         if process_item_callback:
#             item_dict = process_item_callback(item, item_dict)
#         processed_items.append(item_dict)

#     return {
#         data_name: processed_items,
#         "total_items": total,
#         "total_pages": (total + per_page - 1) // per_page,
#         "current_page": page
#     }
