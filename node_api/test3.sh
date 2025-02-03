curl -X POST \
  http://localhost:8081/antennas/4/rfids \
  -H 'Content-Type: application/json' \
  -d '{"rfids": [""], "timestamp": "2023-03-09T14:30:00Z"}'