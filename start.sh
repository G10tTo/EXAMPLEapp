#!/bin/bash
#chmod +x start.sh

# Start the PostgreSQL service
echo "Starting PostgreSQL..."
(cd server && docker-compose up) &

# Start the Node.js backend
echo "Starting Node.js backend..."
(cd server && npm install && npm run dev) &

# Start the React frontend
echo "Starting React frontend..."
(cd client && npm install && npm start) 

# Wait for all background processes to complete
wait
