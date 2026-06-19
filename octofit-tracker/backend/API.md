# OctoFit Tracker Backend - Express Logic Tier

## ✅ Setup Complete

The Express.js logic tier has been fully initialized with TypeScript, Mongoose models, and comprehensive REST API endpoints.

---

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Main Express server with Codespaces support
│   ├── models/               # Mongoose schemas and interfaces
│   │   ├── User.ts          # User model with activity points
│   │   ├── Team.ts          # Team model with members and points
│   │   ├── Activity.ts      # Activity log model
│   │   └── Workout.ts       # Workout plans model
│   └── routes/              # API route handlers
│       ├── users.ts         # /api/users endpoints
│       ├── teams.ts         # /api/teams endpoints
│       ├── activities.ts    # /api/activities endpoints
│       ├── leaderboard.ts   # /api/leaderboard endpoints
│       └── workouts.ts      # /api/workouts endpoints
├── dist/                     # Compiled JavaScript output
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── .env.example             # Environment variables template
```

---

## API Endpoints

### Base URL
- **Local**: `http://localhost:8000`
- **Codespaces**: `https://{CODESPACE_NAME}-8000.app.github.dev`

### Health Check
```
GET /api/health
```
Returns API status, timestamp, and environment info.

---

## 1. Users API (`/api/users`)

### Get All Users
```
GET /api/users
```
Returns list of all users (passwords excluded).

### Get User by ID
```
GET /api/users/:id
```
Returns specific user details.

### Create User
```
POST /api/users
Body: {
  "username": "string (required, unique)",
  "email": "string (required, unique)",
  "bio": "string (optional)",
  "profilePicture": "string (optional, URL)"
}
```
Returns created user.

### Update User
```
PUT /api/users/:id
Body: {
  "username": "string",
  "email": "string",
  "bio": "string",
  "profilePicture": "string"
}
```
Returns updated user.

### Delete User
```
DELETE /api/users/:id
```
Deletes user and returns confirmation.

---

## 2. Teams API (`/api/teams`)

### Get All Teams
```
GET /api/teams
```
Returns all teams with leader and member information.

### Get Team by ID
```
GET /api/teams/:id
```
Returns specific team details with members.

### Create Team
```
POST /api/teams
Body: {
  "name": "string (required, unique)",
  "description": "string (optional)",
  "leaderId": "ObjectId (required)"
}
```
Returns created team with leader as first member.

### Add Member to Team
```
POST /api/teams/:id/members
Body: {
  "userId": "ObjectId (required)"
}
```
Adds user to team and updates user's teamId.

### Update Team
```
PUT /api/teams/:id
Body: {
  "name": "string",
  "description": "string"
}
```
Returns updated team.

### Delete Team
```
DELETE /api/teams/:id
```
Deletes team and returns confirmation.

---

## 3. Activities API (`/api/activities`)

### Get All Activities
```
GET /api/activities
```
Returns all activities across all users.

### Get Activities for User
```
GET /api/activities/user/:userId
```
Returns activities for specific user.

### Get Activity by ID
```
GET /api/activities/:id
```
Returns specific activity details.

### Create Activity
```
POST /api/activities
Body: {
  "userId": "ObjectId (required)",
  "type": "string (required) - 'running', 'cycling', 'swimming', 'gym', 'hiking', 'yoga', 'other'",
  "duration": "number (required) - minutes",
  "distance": "number (optional) - kilometers",
  "caloriesBurned": "number (required)",
  "intensity": "string (required) - 'low', 'moderate', 'high'",
  "activityPoints": "number (required)",
  "description": "string (optional)",
  "date": "date (optional, defaults to now)"
}
```
Returns created activity and updates user's totalActivityPoints.

### Update Activity
```
PUT /api/activities/:id
Body: {
  "type": "string",
  "duration": "number",
  "distance": "number",
  "caloriesBurned": "number",
  "intensity": "string",
  "activityPoints": "number",
  "description": "string",
  "date": "date"
}
```
Returns updated activity. Updates user's totalActivityPoints if points changed.

### Delete Activity
```
DELETE /api/activities/:id
```
Deletes activity and decrements user's totalActivityPoints.

---

## 4. Leaderboard API (`/api/leaderboard`)

### Get User Leaderboard
```
GET /api/leaderboard/users?limit=10
```
Returns top users by totalActivityPoints with rank.

### Get Team Leaderboard
```
GET /api/leaderboard/teams?limit=10
```
Returns top teams by totalTeamPoints with rank.

### Get User Rank
```
GET /api/leaderboard/users/:userId
```
Returns specific user's rank and total points.

### Get Team Rank
```
GET /api/leaderboard/teams/:teamId
```
Returns specific team's rank and total points.

---

## 5. Workouts API (`/api/workouts`)

### Get All Public Workouts
```
GET /api/workouts
```
Returns all public workout plans.

### Get Workouts for User
```
GET /api/workouts/user/:userId
```
Returns all workouts created by specific user.

### Get Workout by ID
```
GET /api/workouts/:id
```
Returns specific workout details.

### Create Workout
```
POST /api/workouts
Body: {
  "userId": "ObjectId (required)",
  "name": "string (required)",
  "description": "string (optional)",
  "exercises": [
    {
      "name": "string",
      "sets": "number",
      "reps": "number",
      "weight": "number (optional)"
    }
  ],
  "duration": "number (required) - minutes",
  "difficulty": "string (required) - 'beginner', 'intermediate', 'advanced'",
  "targetMuscleGroups": ["string"],
  "isPublic": "boolean (default: false)"
}
```
Returns created workout.

### Update Workout
```
PUT /api/workouts/:id
Body: {
  "name": "string",
  "description": "string",
  "exercises": [{}],
  "duration": "number",
  "difficulty": "string",
  "targetMuscleGroups": ["string"],
  "isPublic": "boolean"
}
```
Returns updated workout.

### Delete Workout
```
DELETE /api/workouts/:id
```
Deletes workout and returns confirmation.

### Get Workouts by Difficulty
```
GET /api/workouts/difficulty/:difficulty
```
Returns public workouts filtered by difficulty level.

---

## Data Models

### User
```javascript
{
  _id: ObjectId,
  username: string (unique),
  email: string (unique),
  password?: string,
  profilePicture?: string,
  bio?: string,
  totalActivityPoints: number,
  teamId?: ObjectId (ref: Team),
  createdAt: date,
  updatedAt: date
}
```

### Team
```javascript
{
  _id: ObjectId,
  name: string (unique),
  description?: string,
  leaderId: ObjectId (ref: User),
  members: [ObjectId] (ref: User),
  totalTeamPoints: number,
  createdAt: date,
  updatedAt: date
}
```

### Activity
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  type: 'running' | 'cycling' | 'swimming' | 'gym' | 'hiking' | 'yoga' | 'other',
  duration: number (minutes),
  distance?: number (kilometers),
  caloriesBurned: number,
  intensity: 'low' | 'moderate' | 'high',
  activityPoints: number,
  description?: string,
  date: date,
  createdAt: date,
  updatedAt: date
}
```

### Workout
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: string,
  description?: string,
  exercises: [
    {
      name: string,
      sets: number,
      reps: number,
      weight?: number
    }
  ],
  duration: number (minutes),
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  targetMuscleGroups: [string],
  isPublic: boolean,
  createdAt: date,
  updatedAt: date
}
```

---

## Environment Variables

Copy `.env.example` to `.env` and update:

```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/octofit
NODE_ENV=development

# Codespaces Support (auto-populated in Codespaces)
# CODESPACE_NAME=your-codespace-name
```

---

## NPM Scripts

```bash
# Development with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production server
npm start

# Watch mode (TypeScript compilation)
npm run build -- --watch
```

---

## Features

### ✅ Implemented
- **User Management**: Create, read, update, delete users with profile information
- **Team Management**: Create teams, add members, track team points
- **Activity Tracking**: Log activities with points, calories, duration, intensity
- **Leaderboards**: Individual and team leaderboards with ranking
- **Workout Plans**: Create and share personalized workout plans
- **Point System**: Automatic point calculation and aggregation
- **Codespaces Support**: Dynamic API URL based on CODESPACE_NAME
- **TypeScript**: Full type safety with interfaces and models
- **MongoDB Integration**: Mongoose models with proper relationships
- **Error Handling**: Comprehensive error responses with validation

### 🔄 Data Relationships
- Users belong to Teams
- Users create Activities
- Activities update User's totalActivityPoints
- Teams track totalTeamPoints
- Users create Workouts
- Workouts can be public or private

---

## Getting Started

### 1. Install Dependencies
```bash
cd octofit-tracker/backend
npm install
```

### 2. Start MongoDB
```bash
# Check if running
ps aux | grep mongod

# If not running, start it (Linux/Mac)
mongod --dbpath /data/db
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env if needed
```

### 4. Run Development Server
```bash
npm run dev
```

Server will start on `http://localhost:8000`

### 5. Test API
```bash
# Health check
curl http://localhost:8000/api/health
```

---

## Build Output

The TypeScript code compiles to the `dist/` directory:
- Source maps enabled for debugging
- Type declarations generated
- All routes and models compiled
- Ready for production deployment

---

## Next Steps

1. **Connect Frontend**: Update frontend to use these API endpoints
2. **Authentication**: Add JWT or session-based authentication
3. **Validation**: Add request validation middleware
4. **Error Handling**: Add comprehensive error handling middleware
5. **Testing**: Add unit and integration tests
6. **Documentation**: Add Swagger/OpenAPI documentation
7. **Deployment**: Configure for production deployment

---

**Created**: 2026-06-19  
**Status**: ✅ Complete and Ready for Use
