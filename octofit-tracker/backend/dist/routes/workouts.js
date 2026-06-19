"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Workout_1 = __importDefault(require("../models/Workout"));
const router = (0, express_1.Router)();
// Get all public workouts
router.get('/', async (req, res) => {
    try {
        const workouts = await Workout_1.default.find({ isPublic: true }).populate('userId', 'username email');
        res.json(workouts);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching workouts', error });
    }
});
// Get workouts for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const workouts = await Workout_1.default.find({ userId: req.params.userId }).populate('userId', 'username email');
        res.json(workouts);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching user workouts', error });
    }
});
// Get workout by ID
router.get('/:id', async (req, res) => {
    try {
        const workout = await Workout_1.default.findById(req.params.id).populate('userId', 'username email');
        if (!workout) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.json(workout);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching workout', error });
    }
});
// Create new workout
router.post('/', async (req, res) => {
    try {
        const { userId, name, description, exercises, duration, difficulty, targetMuscleGroups, isPublic } = req.body;
        if (!userId || !name || !duration || !difficulty) {
            return res.status(400).json({ message: 'Missing required workout fields' });
        }
        const newWorkout = new Workout_1.default({
            userId,
            name,
            description,
            exercises: exercises || [],
            duration,
            difficulty,
            targetMuscleGroups: targetMuscleGroups || [],
            isPublic: isPublic || false,
        });
        await newWorkout.save();
        await newWorkout.populate('userId', 'username email');
        res.status(201).json(newWorkout);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating workout', error });
    }
});
// Update workout
router.put('/:id', async (req, res) => {
    try {
        const { name, description, exercises, duration, difficulty, targetMuscleGroups, isPublic } = req.body;
        const updatedWorkout = await Workout_1.default.findByIdAndUpdate(req.params.id, { name, description, exercises, duration, difficulty, targetMuscleGroups, isPublic }, { new: true }).populate('userId', 'username email');
        if (!updatedWorkout) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.json(updatedWorkout);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating workout', error });
    }
});
// Delete workout
router.delete('/:id', async (req, res) => {
    try {
        const deletedWorkout = await Workout_1.default.findByIdAndDelete(req.params.id);
        if (!deletedWorkout) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.json({ message: 'Workout deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting workout', error });
    }
});
// Get workouts by difficulty
router.get('/difficulty/:difficulty', async (req, res) => {
    try {
        const difficulty = req.params.difficulty;
        const workouts = await Workout_1.default.find({
            difficulty,
            isPublic: true,
        }).populate('userId', 'username email');
        res.json(workouts);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching workouts by difficulty', error });
    }
});
exports.default = router;
//# sourceMappingURL=workouts.js.map