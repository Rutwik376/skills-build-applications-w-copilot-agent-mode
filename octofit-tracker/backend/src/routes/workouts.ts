import { Router, Request, Response } from 'express';
import Workout from '../models/Workout';

const router = Router();

// Get all public workouts
router.get('/', async (req: Request, res: Response) => {
  try {
    const workouts = await Workout.find({ isPublic: true }).populate('userId', 'username email');
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workouts', error });
  }
});

// Get workouts for a specific user
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId }).populate('userId', 'username email');
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user workouts', error });
  }
});

// Get workout by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const workout = await Workout.findById(req.params.id).populate('userId', 'username email');
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workout', error });
  }
});

// Create new workout
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, name, description, exercises, duration, difficulty, targetMuscleGroups, isPublic } = req.body;

    if (!userId || !name || !duration || !difficulty) {
      return res.status(400).json({ message: 'Missing required workout fields' });
    }

    const newWorkout = new Workout({
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
  } catch (error) {
    res.status(500).json({ message: 'Error creating workout', error });
  }
});

// Update workout
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, description, exercises, duration, difficulty, targetMuscleGroups, isPublic } = req.body;
    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id,
      { name, description, exercises, duration, difficulty, targetMuscleGroups, isPublic },
      { new: true }
    ).populate('userId', 'username email');

    if (!updatedWorkout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json(updatedWorkout);
  } catch (error) {
    res.status(500).json({ message: 'Error updating workout', error });
  }
});

// Delete workout
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedWorkout = await Workout.findByIdAndDelete(req.params.id);
    if (!deletedWorkout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting workout', error });
  }
});

// Get workouts by difficulty
router.get('/difficulty/:difficulty', async (req: Request, res: Response) => {
  try {
    const difficulty = req.params.difficulty as 'beginner' | 'intermediate' | 'advanced';
    const workouts = await Workout.find({
      difficulty,
      isPublic: true,
    }).populate('userId', 'username email');
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workouts by difficulty', error });
  }
});

export default router;
