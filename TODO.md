# JWT Tokenization Implementation Steps

## Backend (cd event-registration/backend)
1. ✅ Create requirements.txt with JWT deps
2. Install: `pip install -r requirements.txt` (or uvicorn directly)
3. ✅ Update models.py: Add User model + user_id FK to Registration

6. ✅ Create utils.py: JWT functions
4. Update database.py if needed
5. Update schemas.py: Add User schemas, Token schema
6. Create utils.py: JWT functions (verify_token, create_access_token)
7. Update main.py: 
   - /auth/register POST
   - /auth/login POST 
   - Protect /register with Depends(get_current_user)
   - Associate user with registration
8. Restart FastAPI server: `uvicorn main:app --reload --port 8000`

## Frontend (cd event-registration)
9. Install deps if needed: `npm i`
10. Create src/context/AuthContext.jsx
11. Create src/components/Login.jsx + Register.jsx
12. Update App.jsx: Add /login, /auth-register routes + AuthProvider
13. Update EventRegistration.jsx: Use auth token in fetch, protect
14. Update Home.jsx: Add login/register links
15. Test: npm run dev

## Testing
16. Backend: POST /auth/register → /auth/login → GET /register (401 if no token)
17. Frontend: Login → Register event → Success

✅ **JWT Tokenization COMPLETE!** All files updated.

**Test:**
1. Backend: `cd event-registration/backend && uvicorn main:app --reload`
2. Frontend: `cd event-registration && npm run dev`

**Flow:** Home → Login/Register account → Register event (protected by JWT) → Success.

**Backend endpoints:**
- POST /auth/register (form username=email, password)
- POST /auth/login → {access_token}
- POST /register (Authorization: Bearer {token})

Check http://localhost:8000/docs for Swagger UI.

