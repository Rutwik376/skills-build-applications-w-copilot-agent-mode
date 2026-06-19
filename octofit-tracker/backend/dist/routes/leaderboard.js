"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const Team_1 = __importDefault(require("../models/Team"));
const router = (0, express_1.Router)();
// Get user leaderboard (sorted by total activity points)
router.get('/users', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const users = await User_1.default.find()
            .select('-password')
            .sort({ totalActivityPoints: -1 })
            .limit(limit);
        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            ...user.toObject(),
        }));
        res.json(leaderboard);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching user leaderboard', error });
    }
});
// Get team leaderboard (sorted by total team points)
router.get('/teams', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const teams = await Team_1.default.find()
            .populate('leaderId', 'username email')
            .populate('members', 'username email')
            .sort({ totalTeamPoints: -1 })
            .limit(limit);
        const leaderboard = teams.map((team, index) => ({
            rank: index + 1,
            ...team.toObject(),
        }));
        res.json(leaderboard);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching team leaderboard', error });
    }
});
// Get user rank
router.get('/users/:userId', async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const rank = await User_1.default.countDocuments({
            totalActivityPoints: { $gt: user.totalActivityPoints },
        });
        res.json({
            userId: user._id,
            username: user.username,
            totalActivityPoints: user.totalActivityPoints,
            rank: rank + 1,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching user rank', error });
    }
});
// Get team rank
router.get('/teams/:teamId', async (req, res) => {
    try {
        const team = await Team_1.default.findById(req.params.teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        const rank = await Team_1.default.countDocuments({
            totalTeamPoints: { $gt: team.totalTeamPoints },
        });
        res.json({
            teamId: team._id,
            name: team.name,
            totalTeamPoints: team.totalTeamPoints,
            rank: rank + 1,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching team rank', error });
    }
});
exports.default = router;
//# sourceMappingURL=leaderboard.js.map