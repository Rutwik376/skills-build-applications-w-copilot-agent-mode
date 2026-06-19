import { Router, Request, Response } from 'express';
import User from '../models/User';
import Team from '../models/Team';

const router = Router();

// Get user leaderboard (sorted by total activity points)
router.get('/users', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const users = await User.find()
      .select('-password')
      .sort({ totalActivityPoints: -1 })
      .limit(limit);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      ...user.toObject(),
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user leaderboard', error });
  }
});

// Get team leaderboard (sorted by total team points)
router.get('/teams', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const teams = await Team.find()
      .populate('leaderId', 'username email')
      .populate('members', 'username email')
      .sort({ totalTeamPoints: -1 })
      .limit(limit);

    const leaderboard = teams.map((team, index) => ({
      rank: index + 1,
      ...team.toObject(),
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team leaderboard', error });
  }
});

// Get user rank
router.get('/users/:userId', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const rank = await User.countDocuments({
      totalActivityPoints: { $gt: user.totalActivityPoints },
    });

    res.json({
      userId: user._id,
      username: user.username,
      totalActivityPoints: user.totalActivityPoints,
      rank: rank + 1,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user rank', error });
  }
});

// Get team rank
router.get('/teams/:teamId', async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const rank = await Team.countDocuments({
      totalTeamPoints: { $gt: team.totalTeamPoints },
    });

    res.json({
      teamId: team._id,
      name: team.name,
      totalTeamPoints: team.totalTeamPoints,
      rank: rank + 1,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team rank', error });
  }
});

export default router;
