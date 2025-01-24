import requests
import json

# Set the API endpoint URL
url = "http://localhost:8081/sample"

# Set the headers to JSON
headers = {"Content-Type": "application/json"}

# Create 8 sample orders with product IDs from 1 to 8
for product_id in range(1, 9):
    # Define the sample order data
    sample_order_data = {
        "productId": product_id
    }

    # Post the sample order data to the API
    response = requests.post(url, headers=headers, data=json.dumps(sample_order_data))

    # Check if the response was successful
    if response.status_code == 200:
        print(f"Sample order for product {product_id} created successfully!")
        print(response.json())
    else:
        print(f"Error creating sample order for product {product_id}:", response.text)