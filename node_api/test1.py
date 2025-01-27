import requests
import json

# Define the URL
url = "http://localhost:8081/antennas/1/rfids"

# Define the headers
headers = {
    "Content-Type": "application/json"
}

# Define the payload
payload = {
    "rfids": ["E20047165F00602635620111"],
    "timestamp": "2023-02-20T14:30:00.000Z"
}

# Make the POST request
try:
    response = requests.post(url, headers=headers, data=json.dumps(payload))
    # Print the response
    print("Status Code:", response.status_code)
    print("Response Body:", response.text)
except requests.exceptions.RequestException as e:
    print("An error occurred:", e)
