
import mongoose from "mongoose";
import TutorChat from "../models/TutorChat.js";

function getUserId(req) {
  return req.userId;
}

function validId(id) {
  return mongoose.isValidObjectId(id);
}

// GET /api/tutor-chats
export async function getTutorChats(req, res) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Please log in." });
    }

    const chats = await TutorChat.find({ userId })
      .select("title topic createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .lean();

    return res.json({ chats });
  } catch (error) {
    console.error("Get tutor chats error:", error);
    return res.status(500).json({ message: "Unable to load chat history." });
  }
}

// POST /api/tutor-chats
export async function createTutorChat(req, res) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Please log in." });
    }

    const topic =
      typeof req.body.topic === "string"
        ? req.body.topic.trim().slice(0, 150)
        : "";

    const title =
      typeof req.body.title === "string" && req.body.title.trim()
        ? req.body.title.trim().slice(0, 100)
        : "New Chat";

    const chat = await TutorChat.create({
      userId,
      topic,
      title,
      messages: [],
    });

    return res.status(201).json({ chat });
  } catch (error) {
    console.error("Create tutor chat error:", error);
    return res.status(500).json({ message: "Unable to create a chat." });
  }
}

// GET /api/tutor-chats/:id
export async function getTutorChat(req, res) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Please log in." });
    }

    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid chat ID." });
    }

    const chat = await TutorChat.findOne({
      _id: req.params.id,
      userId,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found." });
    }

    return res.json({ chat });
  } catch (error) {
    console.error("Get tutor chat error:", error);
    return res.status(500).json({ message: "Unable to open this chat." });
  }
}

// PATCH /api/tutor-chats/:id
export async function updateTutorChat(req, res) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Please log in." });
    }

    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid chat ID." });
    }

    const updates = {};

    if (typeof req.body.title === "string") {
      updates.title = req.body.title.trim().slice(0, 100) || "New Chat";
    }

    if (typeof req.body.topic === "string") {
      updates.topic = req.body.topic.trim().slice(0, 150);
    }

    if (Array.isArray(req.body.messages)) {
      if (req.body.messages.length > 500) {
        return res.status(400).json({ message: "Too many messages." });
      }

      const messages = [];

      for (const message of req.body.messages) {
        if (
          !message ||
          !["user", "assistant"].includes(message.role) ||
          typeof message.content !== "string" ||
          !message.content.trim() ||
          message.content.length > 30000
        ) {
          return res.status(400).json({
            message: "Invalid message data.",
          });
        }

        messages.push({
          role: message.role,
          content: message.content.trim(),
        });
      }

      updates.messages = messages;
    }

    const chat = await TutorChat.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found." });
    }

    return res.json({ chat });
  } catch (error) {
    console.error("Update tutor chat error:", error);
    return res.status(500).json({ message: "Unable to save this chat." });
  }
}

// DELETE /api/tutor-chats/:id
export async function deleteTutorChat(req, res) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Please log in." });
    }

    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid chat ID." });
    }

    const chat = await TutorChat.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found." });
    }

    return res.json({ message: "Chat deleted successfully." });
  } catch (error) {
    console.error("Delete tutor chat error:", error);
    return res.status(500).json({ message: "Unable to delete this chat." });
  }
}
