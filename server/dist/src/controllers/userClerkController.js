"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = void 0;
const index_1 = require("../index");
const updateUser = async (req, res) => {
    const { userId } = req.params;
    const userData = req.body;
    try {
        // Validate userData
        if (!userData || !userData.publicMetadata) {
            res.status(400).json({ message: "Invalid user data" });
            return;
        }
        // Update user metadata using the Clerk SDK method
        const user = await index_1.clerkClient.users.updateUser(userId, {
            publicMetadata: {
                userType: userData.publicMetadata.userType,
                settings: userData.publicMetadata.settings,
            },
        });
        res.json({ message: "User updated successfully", data: user });
    }
    catch (error) {
        console.error("Error updating user:", error);
        res
            .status(500)
            .json({ message: "Error updating user", error: error.message });
    }
};
exports.updateUser = updateUser;
