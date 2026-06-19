import { Router, Request, Response } from 'express';
import Activity from '../models/Activity';
import User from '../models/User';

const router = Router();

// Get all activities
router.get('/', async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find().populate('userId', 'username email');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities', error });
  }
});

// Get activities for a specific user
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find({ userId: req.params.userId }).populate('userId', 'username email');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user activities', error });
  }
});

// Get activity by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('userId', 'username email');
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity', error });
  }
});

// Create new activity
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, type, duration, distance, caloriesBurned, intensity, activityPoints, description, date } = req.body;

    if (!userId || !type || !duration || !caloriesBurned || !intensity || !activityPoints) {
      return res.status(400).json({ message: 'Missing required activity fields' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const newActivity = new Activity({
      userId,
      type,
      duration,
      distance,
      caloriesBurned,
      intensity,
      activityPoints,
      description,
      date: date || new Date(),
    });

    await newActivity.save();

    // Update user's total activity points
    await User.findByIdAndUpdate(userId, {
      $inc: { totalActivityPoints: activityPoints },
    });

    await newActivity.populate('userId', 'username email');
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ message: 'Error creating activity', error });
  }
});

// Update activity
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { type, duration, distance, caloriesBurned, intensity, activityPoints, description, date } = req.body;
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    const pointDifference = (activityPoints || activity.activityPoints) - activity.activityPoints;

    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      { type, duration, distance, caloriesBurned, intensity, activityPoints, description, date },
      { new: true }
    ).populate('userId', 'username email');

    if (pointDifference !== 0) {
      await User.findByIdAndUpdate(activity.userId, {
        $inc: { totalActivityPoints: pointDifference },
      });
    }

    res.json(updatedActivity);
  } catch (error) {
    res.status(500).json({ message: 'Error updating activity', error });
  }
});

// Delete activity
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Decrement user's total activity points
    await User.findByIdAndUpdate(activity.userId, {
      $inc: { totalActivityPoints: -activity.activityPoints },
    });

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting activity', error });
  }
});

export default router;
