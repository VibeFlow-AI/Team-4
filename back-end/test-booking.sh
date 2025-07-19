#!/bin/bash

# Test script for booking flow
BASE_URL="http://localhost:3001/api"

echo "🔐 Step 1: Login as student..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maya.student@example.com",
    "password": "password123"
  }')

echo "Login Response:"
echo $LOGIN_RESPONSE | jq .

# Extract token
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Login failed! Please check if the server is running and database is seeded."
  exit 1
fi

echo -e "\n🔍 Step 2: Search for mentors..."
MENTORS_RESPONSE=$(curl -s -X GET "$BASE_URL/mentors/search?subjects=Programming&limit=3" \
  -H "Authorization: Bearer $TOKEN")

echo "Mentors found:"
echo $MENTORS_RESPONSE | jq '.mentors[0:2] | .[] | {id: ._id, name: .fullName, subjects: .subjects, rate: .ratePerSession}'

# Extract first mentor ID
MENTOR_ID=$(echo $MENTORS_RESPONSE | jq -r '.mentors[0]._id')

if [ "$MENTOR_ID" = "null" ] || [ -z "$MENTOR_ID" ]; then
  echo "❌ No mentors found! Please seed the database first."
  exit 1
fi

echo -e "\n📅 Step 3: Create booking with mentor: $MENTOR_ID"
BOOKING_RESPONSE=$(curl -s -X POST $BASE_URL/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"mentorId\": \"$MENTOR_ID\",
    \"sessionDateTime\": \"2025-07-25T15:00:00.000Z\",
    \"paymentProofUrl\": \"https://example.com/payment-proof.jpg\"
  }")

echo "Booking Response:"
echo $BOOKING_RESPONSE | jq .

echo -e "\n✅ Test completed!"
echo "Token used: $TOKEN"
echo "Mentor ID used: $MENTOR_ID"
