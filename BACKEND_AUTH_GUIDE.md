# Backend Authentication & User Sync Guide

## Overview
The mobile application uses **Supabase** for authentication (Google Sign-In). However, user management and profile data will be stored in our own **MongoDB** database to allow for future flexibility (e.g., subscriptions, custom fields).

## Authentication Flow
1. **Client (Mobile App):**
   - User signs in with Google via Supabase.
   - Supabase returns a JWT `access_token` and user details (email, name, avatar).
   - The mobile app calls the Backend API `POST /api/users/sync` with this data.

2. **Backend (Node.js + MongoDB):**
   - Receives the user data.
   - Verifies the Supabase token (Optional but recommended).
   - **Upsert** (Update or Insert) the user in the MongoDB `users` collection.
   - Returns the user's backend profile (including subscription status, etc.).

---

## API Contract

### 1. Sync User
**Endpoint:** `POST /api/users/sync`
**Headers:**
- `Authorization`: `Bearer <supabase_access_token>` (Recommended for verifying identity)

**Request Body:**
```json
{
  "supabase_uid": "STRING (required) - The unique ID from Supabase",
  "email": "STRING (required)",
  "full_name": "STRING",
  "avatar_url": "STRING",
  "provider": "google"
}
```

**Response (Success - 200/201):**
```json
{
  "success": true,
  "user": {
    "_id": "MONGO_OBJECT_ID",
    "supabase_uid": "...",
    "email": "...",
    "subscription_tier": "free",
    "createdAt": "..."
  }
}
```

---

## MongoDB Schema Recommendation

We recommend using **Mongoose** for the schema.

```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  supabase_uid: {
    type: String,
    required: true,
    unique: true, // Critical for mapping Supabase users to Mongo users
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  full_name: {
    type: String,
    trim: true
  },
  avatar_url: {
    type: String
  },
  // Future-proofing
  subscription: {
    status: {
      type: String,
      enum: ['active', 'inactive', 'past_due'],
      default: 'inactive'
    },
    tier: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free'
    },
    expires_at: Date
  },
  roles: {
    type: [String],
    default: ['user']
  },
  metadata: { 
    type: Map,
    of: String
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('User', UserSchema);
```

## Implementation Notes for Backend Developer
- **Idempotency:** The `/sync` endpoint calls happens on every login. Ensure you use `findOneAndUpdate` with `{ upsert: true, new: true }` so it doesn't create duplicates.
- **Security:** Ideally, validate the `Authorization` header token using Supabase Admin SDK or JWT verification to ensure the request actually came from that user.
