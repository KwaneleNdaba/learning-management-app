"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserCourseProgress = exports.getUserCourseProgress = exports.getUserEnrolledCourses = void 0;
const express_1 = require("@clerk/express");
const userCourseProgressModel_1 = __importDefault(require("../models/userCourseProgressModel"));
const courseModel_1 = __importDefault(require("../models/courseModel"));
const utils_1 = require("./../../utils/utils");
const utils_2 = require("./../../utils/utils");
const getUserEnrolledCourses = async (req, res) => {
    const { userId } = req.params;
    const auth = (0, express_1.getAuth)(req);
    if (!auth || auth.userId !== userId) {
        res.status(403).json({ message: "Access denied" });
        return;
    }
    try {
        const enrolledCourses = await userCourseProgressModel_1.default.query("userId")
            .eq(userId)
            .exec();
        const courseIds = enrolledCourses.map((item) => item.courseId);
        const courses = await courseModel_1.default.batchGet(courseIds);
        res.json({
            message: "Enrolled courses retrieved successfully",
            data: courses,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error retrieving enrolled courses", error });
    }
};
exports.getUserEnrolledCourses = getUserEnrolledCourses;
const getUserCourseProgress = async (req, res) => {
    const { userId, courseId } = req.params;
    try {
        const progress = await userCourseProgressModel_1.default.get({ userId, courseId });
        if (!progress) {
            res
                .status(404)
                .json({ message: "Course progress not found for this user" });
            return;
        }
        res.json({
            message: "Course progress retrieved successfully",
            data: progress,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error retrieving user course progress", error });
    }
};
exports.getUserCourseProgress = getUserCourseProgress;
const updateUserCourseProgress = async (req, res) => {
    const { userId, courseId } = req.params;
    const progressData = req.body;
    try {
        let progress = await userCourseProgressModel_1.default.get({ userId, courseId });
        if (!progress) {
            // If no progress exists, create initial progress
            progress = new userCourseProgressModel_1.default({
                userId,
                courseId,
                enrollmentDate: new Date().toISOString(),
                overallProgress: 0,
                sections: progressData.sections || [],
                lastAccessedTimestamp: new Date().toISOString(),
            });
        }
        else {
            // Merge existing progress with new progress data
            progress.sections = (0, utils_1.mergeSections)(progress.sections, progressData.sections || []);
            progress.lastAccessedTimestamp = new Date().toISOString();
            progress.overallProgress = (0, utils_2.calculateOverallProgress)(progress.sections);
        }
        await progress.save();
        res.json({
            message: "Course progress retrieved successfuly",
            data: progress,
        });
    }
    catch (error) {
        console.error("Error updating progress:", error);
        res.status(500).json({
            message: "Error updating user course progress",
            error,
        });
    }
};
exports.updateUserCourseProgress = updateUserCourseProgress;
