#!/bin/bash
# Test script for Icon Generator API endpoints

echo "========================================="
echo "Icon Generator API Tests"
echo "========================================="
echo ""

BASE_URL="http://localhost:3300"

# Test 1: Health check
echo "Test 1: Health Check"
echo "GET $BASE_URL/api/health"
curl -s $BASE_URL/api/health | python3 -m json.tool
echo ""
echo ""

# Test 2: List topics
echo "Test 2: List Topics (NEW ENDPOINT)"
echo "GET $BASE_URL/api/icons/topics"
curl -s $BASE_URL/api/icons/topics | python3 -m json.tool
echo ""
echo ""

# Test 3: Get metadata for virtual-memory
echo "Test 3: Get Metadata for virtual-memory (UPDATED ENDPOINT)"
echo "GET $BASE_URL/api/icons/metadata?topicId=virtual-memory"
curl -s "$BASE_URL/api/icons/metadata?topicId=virtual-memory" | python3 -m json.tool | head -30
echo ""
echo ""

# Test 4: Get metadata without topicId (should return 400)
echo "Test 4: Get Metadata without topicId (should return 400)"
echo "GET $BASE_URL/api/icons/metadata"
curl -s $BASE_URL/api/icons/metadata | python3 -m json.tool
echo ""
echo ""

# Test 5: Get metadata for invalid topic (should return 404)
echo "Test 5: Get Metadata for invalid topic (should return 404)"
echo "GET $BASE_URL/api/icons/metadata?topicId=invalid-topic"
curl -s "$BASE_URL/api/icons/metadata?topicId=invalid-topic" | python3 -m json.tool
echo ""
echo ""

echo "========================================="
echo "Tests Complete"
echo "========================================="
echo ""
echo "NEXT STEPS:"
echo "1. Restart server: Stop current server and run 'npm run export-server'"
echo "2. Run this test script again to verify new endpoints"
echo "3. Reload Chrome extension"
echo "4. Test full workflow with extension"
