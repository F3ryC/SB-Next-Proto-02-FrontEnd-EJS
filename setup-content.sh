#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting content setup process...${NC}"

# Install dependencies
echo -e "\n${BLUE}Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install dependencies${NC}"
    exit 1
fi

# Download assets
echo -e "\n${BLUE}Downloading sample assets...${NC}"
npm run download-assets
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to download assets${NC}"
    exit 1
fi

# Seed content
echo -e "\n${BLUE}Seeding content data...${NC}"
npm run seed
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to seed content${NC}"
    exit 1
fi

echo -e "\n${GREEN}Content setup completed successfully!${NC}"
echo -e "\nYou can now:"
echo -e "1. Start the server: ${BLUE}npm run dev${NC}"
echo -e "2. Test the content API: ${BLUE}./test-api.sh${NC}"
echo -e "3. View content in the database: ${BLUE}sqlite3 database.sqlite 'SELECT * FROM Contents;'${NC}" 