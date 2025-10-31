import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import { Meeting } from "../models/meeting.model.js";
import bcrypt, { hash } from "bcryptjs";
import crypto from "crypto";

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User not found" });
    }

    let isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      let token = crypto.randomBytes(64).toString("hex");
      user.tokens.push(token);
      await user.save();
      return res
        .status(httpStatus.OK)
        .json({
          message: "Login successful",
          token,
          user: { name: user.name, username: user.username },
        });
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid password" });
    }
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const register = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(httpStatus.CONFLICT)
        .json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      username: username,
      password: hashedPassword,
    });

    await newUser.save();
    res
      .status(httpStatus.CREATED)
      .json({ message: "User registered successfully" });
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const getUserHistory = async (req, res) => {
  const { username } = req.params;
  const { token } = req.query;

  try {
    const user = await User.findOne({ tokens: { $in: [token] } });
    if (!user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid or expired token" });
    }
    const meetings = await Meeting.find({ user_id: user.username });
    return res.status(httpStatus.OK).json({ meetings });
  } catch (e) {
    console.error("Error in getUserHistory:", e);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

// const addToHistory = async (req, res) => {
//   const { token, meetingCode } = req.body;

//   console.log("Received:", { token, meetingCode });

//   if (!token || !meetingCode) {
//     return res
//       .status(httpStatus.BAD_REQUEST)
//       .json({ message: "Token and meeting code are required" });
//   }

//   try {
//     const user = await User.findOne({ tokens: { $in: [token] } });
//     if (!user) {
//       return res
//         .status(httpStatus.UNAUTHORIZED)
//         .json({ message: "Invalid or expired token" });
//     }

//     console.log("User found:", user.username);

//     const newMeeting = new Meeting({
//       user_id: user.username,
//       meetingCode: meetingCode,
//     });

//     await newMeeting.save();
//     return res
//       .status(httpStatus.CREATED)
//       .json({ message: "Meeting added to history" });
//   } catch (e) {
//     res
//       .status(httpStatus.INTERNAL_SERVER_ERROR)
//       .json({ message: "Internal server error" });
//   }
// };

const addToHistory = async (req, res) => {
  const { token, meetingCode } = req.body;

  console.log("Received:", { token, meetingCode });

  if (!token || !meetingCode) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Token and meeting code are required" });
  }

  try {
    const user = await User.findOne({ tokens: { $in: [token] } });
    if (!user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid or expired token" });
    }

    console.log("User found:", user.username);

    const newMeeting = new Meeting({
      user_id: user.username,
      meetingCode: meetingCode,
    });

    console.log("About to save meeting:", newMeeting);
    await newMeeting.save();
    console.log("Meeting saved successfully!");
    
    return res
      .status(httpStatus.CREATED)
      .json({ message: "Meeting added to history" });
  } catch (e) {
    console.error("=== FULL ERROR ===");
    console.error("Name:", e.name);
    console.error("Message:", e.message);
    console.error("Code:", e.code);
    console.error("Stack:", e.stack);
    console.error("=================");
    
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error: e.message });
  }
};

export { login, register, getUserHistory, addToHistory };
