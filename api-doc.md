# EduVibe API Documentation (v1)

## Introduction

The EduVibe REST API powers the web and mobile clients for **students** and **mentors** described in the VibeFlow hackathon case study.
It supports:

* Multi-step onboarding for students and mentors
* Mentor discovery with personalised recommendations and rich filtering
* Booking & payment upload for 2-hour mentor sessions
* Dashboards—student bookings and mentor session analytics

All endpoints are versioned under `/api/v1`.

---

## Authentication

| Mechanism      | Details                                                                                                                                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **JWT Bearer** | After a successful login/registration, the server returns a signed JSON Web Token. Send it in `Authorization: Bearer <token>` with each subsequent request. Tokens expire after **24 h**; refresh via `/auth/refresh`. |

---

## Endpoints

### 1. Auth

| URL              | Method | Description                                                                 |
| ---------------- | ------ | --------------------------------------------------------------------------- |
| `/auth/register` | `POST` | Register **student** or **mentor**. Body: `{ role, email, password, name }` |
| `/auth/login`    | `POST` | Obtain JWT. Body: `{ email, password }`                                     |
| `/auth/logout`   | `POST` | Invalidate refresh token (optional).                                        |
| `/auth/refresh`  | `POST` | Issue new JWT using a valid refresh token.                                  |

<details><summary>📝 Request / Response examples</summary>

```http
POST /api/v1/auth/login
Content-Type: application/json

{ "email": "maya@example.com", "password": "hunter2" }
```

```http
HTTP/1.1 200 OK
{ "token": "<jwt>", "refreshToken": "<refresh>" }
```

</details>

---

### 2. User profile

| URL         | Method  | Description              |
| ----------- | ------- | ------------------------ |
| `/users/me` | `GET`   | Current user (uses JWT). |
| `/users/me` | `PATCH` | Update profile fields.   |

---

### 3. Student onboarding & flows

| URL                      | Method | Description                                                                            |
| ------------------------ | ------ | -------------------------------------------------------------------------------------- |
| `/students/onboarding`   | `POST` | Submit multi-part onboarding form (basic info, academic background, subject & skills). |
| `/students/:id`          | `GET`  | Public student profile (limited fields).                                               |
| `/students/:id/bookings` | `GET`  | All session bookings for student (explore vs. booked-tab population).                  |

---

### 4. Mentor onboarding & dashboard

| URL                      | Method | Description                                                        |
| ------------------------ | ------ | ------------------------------------------------------------------ |
| `/mentors/onboarding`    | `POST` | Submit mentor onboarding (personal info, expertise, social links). |
| `/mentors/:id`           | `GET`  | Public mentor profile.                                             |
| `/mentors/:id/sessions`  | `GET`  | Upcoming & past sessions (mentor dashboard card list).             |
| `/mentors/:id/analytics` | `GET`  | Aggregated stats: student-age pie & subject bar series.            |

---

### 5. Mentor discovery & recommendation

| URL                    | Method | Description                                                                                |
| ---------------------- | ------ | ------------------------------------------------------------------------------------------ |
| `/mentors`             | `GET`  | Search mentors. Query params: `subjects`, `level`, `language`, `duration`, `page`, `sort`. |
| `/mentors/recommended` | `GET`  | Personalised list ordered by matching algorithm (top suggestions first).                   |

<details><summary>Example request</summary>

`GET /api/v1/mentors?subjects=Physics,Biology&level=Grade10&language=English`

</details>

---

### 6. Booking flow

| URL                    | Method   | Description                                                                                           |
| ---------------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `/bookings`            | `POST`   | Create a booking. Body: `{ mentorId, sessionDateTimeISO, paymentProofUrl }` – duration fixed **2 h**. |
| `/bookings/:id`        | `GET`    | Booking details.                                                                                      |
| `/bookings/:id`        | `DELETE` | Cancel (if >24 h before start).                                                                       |
| `/sessions/:id/status` | `PATCH`  | Mentor accepts / marks “in-progress” / “completed”.                                                   |

---

## Common Schemas (JSON)

### `User`

```json
{
  "id": "uuid",
  "role": "student | mentor",
  "name": "string",
  "email": "string",
  "avatarUrl": "string | null"
}
```

### `Booking`

```json
{
  "id": "uuid",
  "studentId": "uuid",
  "mentorId": "uuid",
  "sessionDateTime": "ISO-8601 string",
  "durationMinutes": 120,
  "paymentProofUrl": "string",
  "status": "pending | confirmed | completed | cancelled"
}
```

---

## Error Handling

| HTTP Code                   | Meaning                               | Typical causes                           |
| --------------------------- | ------------------------------------- | ---------------------------------------- |
| `400 Bad Request`           | Validation failed                     | Missing required field, wrong enum value |
| `401 Unauthorized`          | JWT missing/expired                   |                                          |
| `403 Forbidden`             | Accessing another user’s resource     |                                          |
| `404 Not Found`             | Resource ID doesn’t exist             |                                          |
| `409 Conflict`              | Booking clash (mentor already booked) |                                          |
| `429 Too Many Requests`     | Rate limit exceeded                   |                                          |
| `500 Internal Server Error` | Unhandled exception                   |                                          |

Errors return:

```json
{
  "error": {
    "code": 400,
    "message": "Validation error",
    "details": [ "email is invalid" ]
  }
}
```

---

## Rate Limiting

* **Students & mentors:** 100 requests / minute per access token
* **Unauthenticated:** 20 requests / minute by IP
  `429 Too Many Requests` includes `Retry-After` header.

---

## Versioning

* Base path contains major version (`/api/v1`).
* Backwards-compatible changes add fields or endpoints within the same path.
* Breaking changes trigger `/api/v2` with separate OpenAPI spec.
* `X-EduVibe-API-Version` response header echoes version served.

---

## Changelog

| Version | Date       | Notes                                                               |
| ------- | ---------- | ------------------------------------------------------------------- |
| **1.0** | 2025-07-19 | Initial specification derived from VibeFlow hackathon requirements. |

---

### Appendix A – Sample Booking Lifecycle

1. **Student** fetches `/mentors/recommended` → selects mentor `m1`.
2. `POST /bookings` with chosen `sessionDateTime` and bank-slip URL → returns `pending` booking `b123`.
3. **Mentor** sees `/mentors/me/sessions` → `PATCH /sessions/b123/status` `{ "status":"confirmed" }`.
4. After session, mentor sets status `completed`. Student dashboard reflects update.

---

**End of Document**
