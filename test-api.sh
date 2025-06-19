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

echo -e "\n${GREEN}=== Testing Base Endpoint ===${NC}"
RESPONSE=$(curl -s http://localhost:3000/)
format_output "$RESPONSE"

echo -e "\n${GREEN}=== Testing Profile Endpoint ===${NC}"
echo "Request URL: http://localhost:3000/api/auth/profile"
echo "Authorization: Bearer $TOKEN"
RESPONSE=$(curl -v -s -H "Authorization: Bearer $TOKEN" \
    http://localhost:3000/api/auth/profile 2>&1)
format_output "$RESPONSE"

echo -e "\n${GREEN}=== Testing User Registration ===${NC}"
echo "Request URL: http://localhost:3000/api/auth/register"
echo "Authorization: Bearer $TOKEN"
RESPONSE=$(curl -v -s -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"displayName":"Test User"}' \
    http://localhost:3000/api/auth/register 2>&1)
format_output "$RESPONSE"

echo -e "\n${GREEN}=== Testing Content Endpoints ===${NC}"

echo -e "\n${BLUE}1. Creating new content...${NC}"
echo "Request URL: http://localhost:3000/api/content"
echo "Authorization: Bearer $TOKEN"
RESPONSE=$(curl -v -s -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "title": "Test Content",
        "description": "Test Description",
        "category": "movie",
        "contentType": "video",
        "tags": ["test", "sample"]
    }' \
    http://localhost:3000/api/content 2>&1)
CONTENT_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
format_output "$RESPONSE"

echo -e "\n${BLUE}2. Getting all content...${NC}"
echo "Request URL: http://localhost:3000/api/content"
echo "Authorization: Bearer $TOKEN"
RESPONSE=$(curl -v -s -H "Authorization: Bearer $TOKEN" \
    http://localhost:3000/api/content 2>&1)
format_output "$RESPONSE"

if [ ! -z "$CONTENT_ID" ]; then
    echo -e "\n${BLUE}3. Getting single content...${NC}"
    echo "Request URL: http://localhost:3000/api/content/$CONTENT_ID"
    echo "Authorization: Bearer $TOKEN"
    RESPONSE=$(curl -v -s -H "Authorization: Bearer $TOKEN" \
        http://localhost:3000/api/content/$CONTENT_ID 2>&1)
    format_output "$RESPONSE"

    echo -e "\n${BLUE}4. Updating content...${NC}"
    echo "Request URL: http://localhost:3000/api/content/$CONTENT_ID"
    echo "Authorization: Bearer $TOKEN"
    RESPONSE=$(curl -v -s -X PUT \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "title": "Updated Content",
            "description": "Updated Description"
        }' \
        http://localhost:3000/api/content/$CONTENT_ID 2>&1)
    format_output "$RESPONSE"

    echo -e "\n${BLUE}5. Deleting content...${NC}"
    echo "Request URL: http://localhost:3000/api/content/$CONTENT_ID"
    echo "Authorization: Bearer $TOKEN"
    RESPONSE=$(curl -v -s -X DELETE \
        -H "Authorization: Bearer $TOKEN" \
        http://localhost:3000/api/content/$CONTENT_ID 2>&1)
    format_output "$RESPONSE"
fi

echo -e "\n${GREEN}=== Testing Complete ===${NC}" 