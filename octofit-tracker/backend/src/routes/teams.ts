import { Router, Request, Response } from 'express';
import Team from '../models/Team';
import User from '../models/User';

const router = Router();

// Get all teams
router.get('/', async (req: Request, res: Response) => {
  try {
    const teams = await Team.find().populate('leaderId', 'username email').populate('members', 'username email');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teams', error });
  }
});

// Get team by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id).populate('leaderId', 'username email').populate('members', 'username email');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team', error });
  }
});

// Create new team
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, leaderId } = req.body;

    if (!name || !leaderId) {
      return res.status(400).json({ message: 'Team name and leader ID are required' });
    }

    const leader = await User.findById(leaderId);
    if (!leader) {
      return res.status(400).json({ message: 'Leader not found' });
    }

    const newTeam = new Team({
      name,
      description,
      leaderId,
      members: [leaderId],
      totalTeamPoints: 0,
    });

    await newTeam.save();
    await newTeam.populate('leaderId', 'username email');
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ message: 'Error creating team', error });
  }
});

// Add member to team
router.post('/:id/members', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: userId } },
      { new: true }
    ).populate('members', 'username email');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Update user's team
    await User.findByIdAndUpdate(userId, { teamId: req.params.id });

    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error adding member to team', error });
  }
});

// Update team
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    ).populate('leaderId', 'username email').populate('members', 'username email');

    if (!updatedTeam) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ message: 'Error updating team', error });
  }
});

// Delete team
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedTeam = await Team.findByIdAndDelete(req.params.id);
    if (!deletedTeam) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting team', error });
  }
});

export default router;
