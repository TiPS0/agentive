---
title: "[API Endpoint/Domain]"
status: "active"
date: "YYYY-MM-DD"
tags: ["api", "backend"]
---

# API: [Endpoint or Domain Name]

> **AI Agent Instructions:** This document defines external or internal API contracts. Use this when writing data fetching logic to ensure the correct endpoints, HTTP methods, and payload shapes are used.

## 1. Endpoint Details
- **Base URL:** `/api/v1/...`
- **Method:** `GET | POST | PUT | DELETE`
- **Auth Required:** `Yes/No (Token Type)`

## 2. Request Payload
*Describe the expected body or query parameters in JSON format.*
```json
{
  "example": "data"
}
```

## 3. Response Shape

_Describe the expected response format and status codes._

- **200 OK:**

```json
{
  "success": true
}
```

- **400 Bad Request:** (Error handling details)
