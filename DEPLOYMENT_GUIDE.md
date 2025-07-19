# Backend Deployment Guide

## Issue
The HOD assignment feature is showing 404 errors because the backend code changes haven't been deployed to the live server yet.

## Current Status
- ✅ Frontend code is ready
- ✅ Backend code is ready and tested locally
- ❌ Backend changes not deployed to live server

## Steps to Fix

### Option 1: Deploy to Render (Recommended)

1. **Push your changes to GitHub:**
   ```bash
   git add .
   git commit -m "Add HOD assignment feature"
   git push origin main
   ```

2. **Deploy to Render:**
   - Go to your Render dashboard
   - Find your SAMS backend service
   - Click "Manual Deploy" → "Deploy latest commit"
   - Wait for deployment to complete (usually 2-5 minutes)

3. **Verify Deployment:**
   - Test the health endpoint: `https://sams-5crs.onrender.com/api/health`
   - Test the new endpoints:
     - `https://sams-5crs.onrender.com/department/hods`
     - `https://sams-5crs.onrender.com/department/assignments`

### Option 2: Deploy to Alternative Platform

If Render is not working, you can deploy to:
- **Railway**: https://railway.app/
- **Heroku**: https://heroku.com/
- **Vercel**: https://vercel.com/ (for Node.js)

### Option 3: Run Locally for Testing

1. **Start the backend locally:**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Update frontend API config:**
   ```typescript
   // frontend/src/config/api.config.ts
   const getApiBaseUrl = () => {
     return 'http://localhost:5000/';
   };
   ```

3. **Start the frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Files Changed

### Backend Files:
- `backend/Controllers/DepartmentAssignmentController.js` - Enhanced with new functions
- `backend/Routes/departmentAssignRouter.js` - Added new routes
- `backend/Models/User.js` - HOD schema (already existed)
- `backend/Models/AssignedDepartments.js` - Assignment model (already existed)

### Frontend Files:
- `frontend/src/modules/user-management1/services/hod.service.ts` - New service
- `frontend/src/modules/user-management1/components/dashboard/HODAssignmentModal.tsx` - New component
- `frontend/src/modules/user-management1/components/dashboard/HODAssignmentManager.tsx` - New component
- `frontend/src/modules/user-management1/components/dashboard/AdminDashboard.tsx` - Updated
- `frontend/src/modules/user-management1/components/dashboard/DashboardNav.tsx` - Updated
- `frontend/src/modules/user-management1/services/auth.service.ts` - Updated

## Verification Steps

After deployment, verify these endpoints work:

1. **Health Check:**
   ```bash
   curl https://sams-5crs.onrender.com/api/health
   ```

2. **HODs Endpoint:**
   ```bash
   curl https://sams-5crs.onrender.com/department/hods
   ```

3. **Assignments Endpoint:**
   ```bash
   curl https://sams-5crs.onrender.com/department/assignments
   ```

## Troubleshooting

### If endpoints still return 404:
1. Check if the deployment completed successfully
2. Verify the routes are properly mounted in `server.js`
3. Check the server logs for any errors
4. Ensure all dependencies are installed

### If you get CORS errors:
1. Check the `allowedOrigins` array in `server.js`
2. Add your frontend URL to the allowed origins

### If you get authentication errors:
1. Ensure you're logged in as an admin
2. Check if the JWT token is valid
3. Verify the authentication middleware is working

## Environment Variables

Make sure these environment variables are set in your deployment:
- `mongoUri` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `NODE_ENV` - Environment (production/development)

## Support

If you continue to have issues:
1. Check the browser console for detailed error messages
2. Check the server logs for backend errors
3. Verify all files are properly committed and pushed
4. Ensure the deployment platform is working correctly 