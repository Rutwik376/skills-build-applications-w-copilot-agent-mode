"use strict";
/**
 * Seed the octofit_db database with test data
 *
 * This script populates the OctoFit Tracker database with realistic sample data
 * for users, teams, activities, and workouts.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
const Team_1 = __importDefault(require("../models/Team"));
const Activity_1 = __importDefault(require("../models/Activity"));
const Workout_1 = __importDefault(require("../models/Workout"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB at', MONGODB_URI);
        // Clear existing data
        console.log('\nClearing existing data...');
        await User_1.default.deleteMany({});
        await Team_1.default.deleteMany({});
        await Activity_1.default.deleteMany({});
        await Workout_1.default.deleteMany({});
        console.log('✓ Database cleared');
        // Create sample users
        console.log('\n📝 Creating sample users...');
        const users = await User_1.default.insertMany([
            {
                username: 'alex_runner',
                email: 'alex@example.com',
                bio: 'Marathon enthusiast and fitness coach',
                profilePicture: 'https://api.example.com/avatar/alex.jpg',
                totalActivityPoints: 0,
            },
            {
                username: 'jordan_cyclist',
                email: 'jordan@example.com',
                bio: 'Road cycling and mountain biking',
                profilePicture: 'https://api.example.com/avatar/jordan.jpg',
                totalActivityPoints: 0,
            },
            {
                username: 'sam_swimmer',
                email: 'sam@example.com',
                bio: 'Triathlon competitor',
                profilePicture: 'https://api.example.com/avatar/sam.jpg',
                totalActivityPoints: 0,
            },
            {
                username: 'casey_yogini',
                email: 'casey@example.com',
                bio: 'Yoga instructor and wellness coach',
                profilePicture: 'https://api.example.com/avatar/casey.jpg',
                totalActivityPoints: 0,
            },
            {
                username: 'morgan_gym',
                email: 'morgan@example.com',
                bio: 'Strength training and powerlifting',
                profilePicture: 'https://api.example.com/avatar/morgan.jpg',
                totalActivityPoints: 0,
            },
            {
                username: 'taylor_hiker',
                email: 'taylor@example.com',
                bio: 'Trail running and hiking explorer',
                profilePicture: 'https://api.example.com/avatar/taylor.jpg',
                totalActivityPoints: 0,
            },
        ]);
        console.log(`✓ Created ${users.length} users`);
        for (const user of users) {
            console.log(`  - ${user.username} (${user.email})`);
        }
        // Create sample teams
        console.log('\n👥 Creating sample teams...');
        const [alexUser, jordanUser, samUser, caseyUser, morganUser, taylorUser] = users;
        const teams = await Team_1.default.insertMany([
            {
                name: 'Morning Runners',
                description: 'Early bird runners who hit the pavement before sunrise',
                leaderId: alexUser._id,
                members: [alexUser._id, taylorUser._id],
                totalTeamPoints: 0,
            },
            {
                name: 'Cycling Crew',
                description: 'Road and mountain biking adventures',
                leaderId: jordanUser._id,
                members: [jordanUser._id, alexUser._id],
                totalTeamPoints: 0,
            },
            {
                name: 'Fitness Warriors',
                description: 'Gym enthusiasts pushing their limits',
                leaderId: morganUser._id,
                members: [morganUser._id, samUser._id, caseyUser._id],
                totalTeamPoints: 0,
            },
        ]);
        console.log(`✓ Created ${teams.length} teams`);
        for (const team of teams) {
            console.log(`  - ${team.name} (Leader: ${alexUser.username})`);
        }
        // Update users with team references
        await User_1.default.findByIdAndUpdate(alexUser._id, { teamId: teams[0]._id });
        await User_1.default.findByIdAndUpdate(taylorUser._id, { teamId: teams[0]._id });
        await User_1.default.findByIdAndUpdate(jordanUser._id, { teamId: teams[1]._id });
        await User_1.default.findByIdAndUpdate(morganUser._id, { teamId: teams[2]._id });
        await User_1.default.findByIdAndUpdate(samUser._id, { teamId: teams[2]._id });
        await User_1.default.findByIdAndUpdate(caseyUser._id, { teamId: teams[2]._id });
        // Create sample activities
        console.log('\n🏃 Creating sample activities...');
        const activities = await Activity_1.default.insertMany([
            {
                userId: alexUser._id,
                type: 'running',
                duration: 45,
                distance: 8.5,
                caloriesBurned: 650,
                intensity: 'high',
                activityPoints: 120,
                description: 'Morning run at the local park',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            },
            {
                userId: alexUser._id,
                type: 'running',
                duration: 30,
                distance: 5,
                caloriesBurned: 450,
                intensity: 'moderate',
                activityPoints: 80,
                description: 'Evening jog',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            },
            {
                userId: jordanUser._id,
                type: 'cycling',
                duration: 60,
                distance: 35,
                caloriesBurned: 700,
                intensity: 'high',
                activityPoints: 140,
                description: 'Mountain bike trail at Whistler',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            },
            {
                userId: jordanUser._id,
                type: 'cycling',
                duration: 45,
                distance: 25,
                caloriesBurned: 550,
                intensity: 'moderate',
                activityPoints: 100,
                description: 'Road cycling commute',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            },
            {
                userId: samUser._id,
                type: 'swimming',
                duration: 50,
                distance: 2.5,
                caloriesBurned: 600,
                intensity: 'high',
                activityPoints: 130,
                description: 'Triathlon prep - 2.5km swim',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            },
            {
                userId: caseyUser._id,
                type: 'yoga',
                duration: 75,
                distance: 0,
                caloriesBurned: 250,
                intensity: 'moderate',
                activityPoints: 60,
                description: 'Vinyasa flow yoga class',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            },
            {
                userId: morganUser._id,
                type: 'gym',
                duration: 90,
                distance: 0,
                caloriesBurned: 800,
                intensity: 'high',
                activityPoints: 150,
                description: 'Upper body strength training',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            },
            {
                userId: taylorUser._id,
                type: 'hiking',
                duration: 120,
                distance: 12,
                caloriesBurned: 900,
                intensity: 'moderate',
                activityPoints: 110,
                description: 'Mountain trail hiking with views',
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            },
            {
                userId: taylorUser._id,
                type: 'running',
                duration: 40,
                distance: 7,
                caloriesBurned: 600,
                intensity: 'high',
                activityPoints: 100,
                description: 'Trail running at sunset',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            },
        ]);
        console.log(`✓ Created ${activities.length} activities`);
        for (const activity of activities) {
            console.log(`  - ${activity.type} (${activity.duration}min, +${activity.activityPoints}pts)`);
        }
        // Update user activity points
        console.log('\n📊 Updating user activity points...');
        for (const activity of activities) {
            await User_1.default.findByIdAndUpdate(activity.userId, {
                $inc: { totalActivityPoints: activity.activityPoints },
            });
        }
        console.log('✓ User points updated');
        // Create sample workouts
        console.log('\n💪 Creating sample workouts...');
        const workouts = await Workout_1.default.insertMany([
            {
                userId: alexUser._id,
                name: 'Beginner Running Plan',
                description: 'Get started with running - 4 week beginner plan',
                exercises: [
                    { name: 'Warm-up jog', sets: 1, reps: 5, weight: 0 },
                    { name: 'Main run', sets: 1, reps: 20, weight: 0 },
                    { name: 'Cool-down walk', sets: 1, reps: 5, weight: 0 },
                ],
                duration: 30,
                difficulty: 'beginner',
                targetMuscleGroups: ['legs', 'cardio'],
                isPublic: true,
            },
            {
                userId: morganUser._id,
                name: 'Advanced Strength Training',
                description: 'High-intensity upper body workout',
                exercises: [
                    { name: 'Bench press', sets: 4, reps: 6, weight: 225 },
                    { name: 'Barbell rows', sets: 4, reps: 6, weight: 225 },
                    { name: 'Pull-ups', sets: 3, reps: 10, weight: 0 },
                    { name: 'Dumbbell flyes', sets: 3, reps: 12, weight: 70 },
                ],
                duration: 90,
                difficulty: 'advanced',
                targetMuscleGroups: ['chest', 'back', 'shoulders'],
                isPublic: true,
            },
            {
                userId: caseyUser._id,
                name: 'Yoga for Beginners',
                description: 'Gentle yoga flow for flexibility and relaxation',
                exercises: [
                    { name: 'Sun salutations', sets: 5, reps: 1, weight: 0 },
                    { name: 'Warrior poses', sets: 3, reps: 2, weight: 0 },
                    { name: 'Savasana', sets: 1, reps: 10, weight: 0 },
                ],
                duration: 60,
                difficulty: 'beginner',
                targetMuscleGroups: ['flexibility', 'balance'],
                isPublic: true,
            },
            {
                userId: jordanUser._id,
                name: 'HIIT Cardio Blast',
                description: 'High-intensity interval training for maximum calorie burn',
                exercises: [
                    { name: 'Burpees', sets: 5, reps: 30, weight: 0 },
                    { name: 'Mountain climbers', sets: 5, reps: 30, weight: 0 },
                    { name: 'Jump squats', sets: 5, reps: 20, weight: 0 },
                ],
                duration: 30,
                difficulty: 'advanced',
                targetMuscleGroups: ['cardio', 'legs', 'core'],
                isPublic: true,
            },
            {
                userId: samUser._id,
                name: 'Intermediate Swimming Drills',
                description: 'Build endurance and technique',
                exercises: [
                    { name: 'Freestyle laps', sets: 10, reps: 100, weight: 0 },
                    { name: 'Backstroke drills', sets: 5, reps: 50, weight: 0 },
                    { name: 'Kick with board', sets: 5, reps: 100, weight: 0 },
                ],
                duration: 60,
                difficulty: 'intermediate',
                targetMuscleGroups: ['swimming', 'cardio'],
                isPublic: true,
            },
        ]);
        console.log(`✓ Created ${workouts.length} workouts`);
        for (const workout of workouts) {
            console.log(`  - ${workout.name} (${workout.difficulty}, ${workout.duration}min)`);
        }
        // Display summary
        console.log('\n' + '='.repeat(50));
        console.log('✅ DATABASE SEEDING COMPLETE!');
        console.log('='.repeat(50));
        console.log(`\n📊 Summary:`);
        console.log(`  • Users created: ${users.length}`);
        console.log(`  • Teams created: ${teams.length}`);
        console.log(`  • Activities created: ${activities.length}`);
        console.log(`  • Workouts created: ${workouts.length}`);
        // Display user points
        console.log(`\n🏆 User Points:`);
        const updatedUsers = await User_1.default.find().sort({ totalActivityPoints: -1 });
        for (let i = 0; i < updatedUsers.length; i++) {
            console.log(`  ${i + 1}. ${updatedUsers[i].username}: ${updatedUsers[i].totalActivityPoints} points`);
        }
        console.log(`\n✓ Database ready for testing!`);
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}
// Run the seed script
seedDatabase();
//# sourceMappingURL=seed.js.map