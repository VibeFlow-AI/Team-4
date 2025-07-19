Below is a **fully-expanded reference** for every public EduVibe endpoint.
For each one you’ll find **URL, HTTP method, path variables, query parameters, request body schema, success response, and common errors**.

> **Notation**
> • *T* = string  • *I* = integer  • *B* = boolean  • *ISO* = ISO-8601 date-time
> • Optional fields are marked **?**.
> • All payload examples are JSON (`Content-Type: application/json; charset=utf-8`).
> • All endpoints require the `Authorization: Bearer <JWT>` header unless explicitly noted “No auth”.

---

## 1  Authentication

| #   | URL              | Method   | Path Vars | Query | Request Body                                                   | Success (200/201)                                  | Errors         |
| --- | ---------------- | -------- | --------- | ----- | -------------------------------------------------------------- | -------------------------------------------------- | -------------- |
| 1.1 | `/auth/register` | **POST** | –         | –     | `{ role: "student" \| "mentor", email:T, password:T, name:T }` | `{ token:T, refreshToken:T, expiresIn:I }` **201** | 400 validation |
| 1.2 | `/auth/login`    | **POST** | –         | –     | `{ email:T, password:T }`                                      | idem **200**                                       | 400, 401       |
| 1.3 | `/auth/refresh`  | **POST** | –         | –     | `{ refreshToken:T }`                                           | idem **200**                                       | 400, 401       |
| 1.4 | `/auth/logout`   | **POST** | –         | –     | `{ refreshToken:T }`                                           | `{ message:"logged out" }` **200**                 | 400            |

**No auth** required for 1.1 – 1.3.

---

## 2  User Profiles

| #   | URL           | Method    | Path Vars   | Query | Request Body    | Success                | Errors   |
| --- | ------------- | --------- | ----------- | ----- | --------------- | ---------------------- | -------- |
| 2.1 | `/users/me`   | **GET**   | –           | –     | –               | `User` **200**         | 401      |
| 2.2 | `/users/me`   | **PATCH** | –           | –     | `Partial<User>` | updated `User` **200** | 400, 401 |
| 2.3 | `/users/{id}` | **GET**   | `{id:uuid}` | –     | –               | `PublicUser` **200**   | 404      |

`User` object

```jsonc
{
  "id": "uuid",
  "role": "student",
  "name": "Maya Jayawardena",
  "email": "maya@example.com",
  "avatarUrl": null
}
```

---

## 3  Student Module

| #   | URL                       | Method   | Path Vars   | Query              | Request Body        | Success                  | Errors   |
| --- | ------------------------- | -------- | ----------- | ------------------ | ------------------- | ------------------------ | -------- |
| 3.1 | `/students/onboarding`    | **POST** | –           | –                  | `StudentOnboarding` | `StudentProfile` **201** | 400      |
| 3.2 | `/students/{id}`          | **GET**  | `{id:uuid}` | –                  | –                   | `StudentProfile` **200** | 404      |
| 3.3 | `/students/{id}/bookings` | **GET**  | `{id:uuid}` | `status?`:T (enum) | –                   | `[Booking]` **200**      | 403, 404 |

`StudentOnboarding` (schema)

```jsonc
{
  "fullName": "T",
  "age": I,
  "contactNumber": "T",
  "school": "T",
  "educationLevel": "T",
  "subjects": ["T"],
  "skills": [
    { "subject": "T", "level": "Beginner|Intermediate|Advanced" }
  ],
  "preferredLearningStyle": "T?",
  "accommodations": "T?"
}
```

---

## 4  Mentor Module

| #   | URL                       | Method   | Path Vars   | Query                                                                                       | Request Body       | Success                          | Errors                                           |     |
| --- | ------------------------- | -------- | ----------- | ------------------------------------------------------------------------------------------- | ------------------ | -------------------------------- | ------------------------------------------------ | --- |
| 4.1 | `/mentors/onboarding`     | **POST** | –           | –                                                                                           | `MentorOnboarding` | `MentorProfile` **201**          | 400                                              |     |
| 4.2 | `/mentors/{id}`           | **GET**  | `{id:uuid}` | –                                                                                           | –                  | `MentorProfile` **200**          | 404                                              |     |
| 4.3 | `/mentors`                | **GET**  | –           | `subjects?`:T, `level?`:T, `language?`:T, `duration?`:I, `page?`:I (≥1), `sort?`:T("rating" | "price")           | –                                | `{ data:[MentorCard], page:I, total:I }` **200** | 400 |
| 4.4 | `/mentors/recommended`    | **GET**  | –           | –                                                                                           | –                  | `[MentorCard]` **200**           | 401                                              |     |
| 4.5 | `/mentors/{id}/sessions`  | **GET**  | `{id:uuid}` | –                                                                                           | –                  | `[Session]` **200**              | 403, 404                                         |     |
| 4.6 | `/mentors/{id}/analytics` | **GET**  | `{id:uuid}` | –                                                                                           | –                  | `{ agePie, subjectBar }` **200** | 403, 404                                         |     |

`MentorOnboarding`

```jsonc
{
  "fullName": "T",
  "age": I,
  "contactNumber": "T",
  "bio": "T",
  "professionalRole": "T",
  "subjects": ["T"],
  "experienceYears": I,
  "preferredStudentLevels": ["T"],
  "linkedinUrl": "T?",
  "portfolioUrl": "T?",
  "avatarUrl": "T?"
}
```

---

## 5  Booking & Session Lifecycle

| #   | URL                     | Method     | Path Vars   | Query | Request Body                                                | Success                           | Errors          |                           |               |
| --- | ----------------------- | ---------- | ----------- | ----- | ----------------------------------------------------------- | --------------------------------- | --------------- | ------------------------- | ------------- |
| 5.1 | `/bookings`             | **POST**   | –           | –     | `{ mentorId:uuid, sessionDateTime:ISO, paymentProofUrl:T }` | `Booking` **201**                 | 400, 409        |                           |               |
| 5.2 | `/bookings/{id}`        | **GET**    | `{id:uuid}` | –     | –                                                           | `Booking` **200**                 | 403, 404        |                           |               |
| 5.3 | `/bookings/{id}`        | **DELETE** | `{id:uuid}` | –     | –                                                           | `{ message:"cancelled" }` **204** | 403, 404, 409   |                           |               |
| 5.4 | `/sessions/{id}/status` | **PATCH**  | `{id:uuid}` | –     | \`{ status:"confirmed"                                      | "in-progress"                     | "completed" }\` | updated `Booking` **200** | 400, 403, 404 |

`Booking`

```json
{
  "id": "uuid",
  "studentId": "uuid",
  "mentorId": "uuid",
  "sessionDateTime": "2025-07-25T09:00:00Z",
  "durationMinutes": 120,
  "paymentProofUrl": "https://...",
  "status": "pending"
}
```

---

## 6  Common Error Payload

```json
{
  "error": {
    "code": 400,
    "message": "Validation failed",
    "details": ["email is invalid"]
  }
}
```

* **400 Bad Request** – malformed or invalid data
* **401 Unauthorized** – JWT missing/expired
* **403 Forbidden** – resource owned by another user
* **404 Not Found** – id not present
* **409 Conflict** – double-booked slot, late cancellation, duplicate registration
* **429 Too Many Requests** – rate limit (header `Retry-After`)
* **500 Internal Server Error**

---

## 7  Rate Limiting & Versioning

| Rule            | Limit             |
| --------------- | ----------------- |
| Authenticated   | 100 req/min/token |
| Unauthenticated | 20 req/min/IP     |

> Major version in path (`/api/v1`). Breaking changes → **v2**; additive changes remain within v1.

---

### Glossary

| Term           | Meaning                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------ |
| **MentorCard** | Subset of mentor profile shown in listings (`id`, `fullName`, `avatarUrl`, `subjects`, `rating`, `ratePerSession`) |
| **Session**    | A `Booking` viewed from the mentor’s perspective                                                                   |
| **agePie**     | `{ "13-15":25, "16-18":40, "18+":35 }` (percentages)                                                               |
| **subjectBar** | `{ "Physics":12, "Chemistry":9, "Biology":6 }` (session counts)                                                    |

---

**End of Expanded Endpoint Reference**
