const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

exports.auth = async (req, res, next) => {
    try {
        let authHeader = req.header("Authorization") || req.headers?.authorization;
        let token = null;

        if (authHeader) {
            token = authHeader.replace(/^Bearer\s+/i, "").trim();
        } else if (req.cookies?.token) {
            token = req.cookies.token;
        } else if (req.body?.token) {
            token = req.body.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing. Please log in.",
            });
        }

        // Clean up quotes if stringified
        if (typeof token === "string") {
            token = token.replace(/^["']|["']$/g, "").trim();
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        } catch (err) {
            console.error("JWT Verification Error:", err.message);
            return res.status(401).json({
                success: false,
                message: "Token is invalid or expired. Please log in again.",
            });
        }

        next();
    } catch (err) {
        console.error("Auth Middleware Error:", err);
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token",
        });
    }
};

exports.isStudent = async (req, res, next) => {
    try {
        if (req.user?.accountType?.toLowerCase() !== "student") {
            return res.status(401).json({
                success: false,
                message: "This route is only for students",
            });
        }
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified",
        });
    }
};

exports.isTeacher = async (req, res, next) => {
    try {
        if (req.user?.accountType?.toLowerCase() !== "instructor") {
            return res.status(401).json({
                success: false,
                message: "This route is only for instructors",
            });
        }
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified",
        });
    }
};

exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user?.accountType?.toLowerCase() !== "admin") {
            return res.status(401).json({
                success: false,
                message: "This route is only for admins",
            });
        }
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified",
        });
    }
};