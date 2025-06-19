#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to format JSON or show raw output
format_output() {
    if [ -z "$1" ]; then
        echo "Empty response"
    else
        echo "$1" | json_pp 2>/dev/null || echo "$1"
    fi
}

echo -e "${BLUE}Getting authentication token...${NC}"
# Get the token and debug info from test-auth.js
echo "Debug output from test-auth.js:"
echo "------------------------------"
TEST_AUTH_OUTPUT=$(node test-auth.js)
echo "$TEST_AUTH_OUTPUT"
echo "------------------------------"

# Extract token from the TOKEN= line
TOKEN=$(echo "$TEST_AUTH_OUTPUT" | grep "^TOKEN=" | cut -d'=' -f2)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}Failed to get authentication token${NC}"
    exit 1
fi

echo -e "\n${GREEN}Token retrieved successfully: $TOKEN${NC}"

# Test Variables
NEW_USER_EMAIL="testuser@example.com"
NEW_USER_PASSWORD="testpass123"
NEW_USER_DISPLAY_NAME="Test User"

echo -e "\n${GREEN}=== Testing User Management Endpoints ===${NC}"

echo -e "\n${BLUE}1. Get All Users (Admin Only)${NC}"
echo "Request URL: http://localhost:3000/api/users"
echo "Authorization: Bearer $TOKEN"
RESPONSE=$(curl -v -s -H "Authorization: Bearer $TOKEN" \
    http://localhost:3000/api/users 2>&1)
format_output "$RESPONSE"

echo -e "\n${BLUE}2. Create New User (Admin Only)${NC}"
echo "Request URL: http://localhost:3000/api/users"
echo "Authorization: Bearer $TOKEN"
RESPONSE=$(curl -v -s -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"email\": \"$NEW_USER_EMAIL\",
        \"password\": \"$NEW_USER_PASSWORD\",
        \"displayName\": \"$NEW_USER_DISPLAY_NAME\",
        \"role\": \"user\"
    }" \
    http://localhost:3000/api/users 2>&1)
format_output "$RESPONSE"

# Extract the new user ID from response
NEW_USER_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$NEW_USER_ID" ]; then
    echo -e "\n${BLUE}3. Get User by ID${NC}"
    echo "Request URL: http://localhost:3000/api/users/$NEW_USER_ID"
    echo "Authorization: Bearer $TOKEN"
    RESPONSE=$(curl -v -s -H "Authorization: Bearer $TOKEN" \
        http://localhost:3000/api/users/$NEW_USER_ID 2>&1)
    format_output "$RESPONSE"

    echo -e "\n${BLUE}4. Update User${NC}"
    echo "Request URL: http://localhost:3000/api/users/$NEW_USER_ID"
    echo "Authorization: Bearer $TOKEN"
    RESPONSE=$(curl -v -s -X PUT \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "displayName": "Updated Test User",
            "role": "content_creator"
        }' \
        http://localhost:3000/api/users/$NEW_USER_ID 2>&1)
    format_output "$RESPONSE"

    echo -e "\n${BLUE}5. Delete User${NC}"
    echo "Request URL: http://localhost:3000/api/users/$NEW_USER_ID"
    echo "Authorization: Bearer $TOKEN"
    RESPONSE=$(curl -v -s -X DELETE \
        -H "Authorization: Bearer $TOKEN" \
        http://localhost:3000/api/users/$NEW_USER_ID 2>&1)
    format_output "$RESPONSE"
fi

echo -e "\n${GREEN}=== Testing Complete ===${NC}" 