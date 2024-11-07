require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");
const multer = require("multer");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Note = require("./models/note.model");
const Document = require("./models/document.modle");
const adminRouter = require("./routes/adminRoute");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

// Create Account
app.post("/create-account", async (req, res) => {
  const {
    titleName,
    fullName,
    email,
    password,
    studentId,
    faculty,
    advisor,
    major,
    address,
    mobile,
  } = req.body;

  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full Name is required" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  if (!studentId) {
    return res
      .status(400)
      .json({ error: true, message: "Student ID is required" });
  }

  if (!faculty) {
    return res
      .status(400)
      .json({ error: true, message: "Faculty is required" });
  }

  if (!major) {
    return res.status(400).json({ error: true, message: "Major is required" });
  }
  if (!advisor) {
    return res
      .status(400)
      .json({ error: true, message: "advisor is required" });
  }

  const isUser = await User.findOne({ email });

  if (isUser) {
    return res.json({ error: true, message: "User already exists" });
  }

  const user = new User({
    titleName,
    fullName,
    email,
    password,
    studentId,
    advisor,
    faculty,
    major,
    address,
    mobile,
  });

  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration successful!",
  });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const userInfo = await User.findOne({ email });

  if (!userInfo) {
    return res.status(400).json({ message: "User not found" });
  }

  if (userInfo.email === email && userInfo.password === password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });

    return res.json({
      error: false,
      message: "Login successful!",
      email,
      accessToken,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Invalid credentials",
    });
  }
});

// Get user
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;

  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) {
    return res.sendStatus(401);
  }

  return res.json({
    user: {
      titleName: isUser.titleName,
      fullName: isUser.fullName,
      studentId: isUser.studentId,
      faculty: isUser.faculty,
      major: isUser.major,
      address: {
        homeAddress: isUser.address?.homeAddress || "N/A",
        moo: isUser.address?.moo || "N/A",
        soi: isUser.address?.soi || "N/A",
        street: isUser.address?.street || "N/A",
        subDistrict: isUser.address?.subDistrict || "N/A",
        District: isUser.address?.District || "N/A",
        province: isUser.address?.province || "N/A",
        postCode: isUser.address?.postCode || "N/A",
      },
      advisor: isUser.advisor,
      mobile: isUser.mobile || "N/A",
      _id: isUser._id,
      createdOn: isUser.createdOn,
    },
    message: "",
  });
});

// Add Note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required" });
  }

  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "Content is required" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note added successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error!",
    });
  }
});

// Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags) {
    return res.status(400).json({ error: true, message: "No change provided" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned; // Allow updating pinned state

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error!",
    });
  }
});

// Get All Notes
app.get("/get-all-notes/", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

    return res.json({
      error: false,
      notes,
      message: "All notes retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    await Note.deleteOne({ _id: noteId, userId: user._id });

    return res.json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Update IsPinned
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Pin status updated successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error!",
    });
  }
});

// เพิ่มเอกสาร
app.post("/add-document", authenticateToken, async (req, res) => {
  const { woldLike, reasons, titleName } = req.body;
  const { user } = req.user;

  if (!woldLike) {
    return res
      .status(400)
      .json({ error: true, message: "woldLike is required" });
  }

  if (!reasons) {
    return res
      .status(400)
      .json({ error: true, message: "reasons is required" });
  }

  try {
    const document = new Document({
      woldLike,
      titleName,
      reasons,
      userId: user._id,
      createdOn: new Date(),
    });

    await document.save();
    return res.json({
      error: false,
      document,
      message: "Document added successfully!",
    });
  } catch (error) {
    console.error("Error saving document:", error); // เพิ่มบรรทัดนี้เพื่อดูข้อมูลข้อผิดพลาด
    return res.status(500).json({
      error: true,
      message: "Internal Server Error!",
    });
  }
});

// Get All Documents for User
app.get("/get-user-documents/", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const documents = await Document.find({ userId: user._id });

    return res.json({
      error: false,
      documents,
      message: "No documents found",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});
// app.get("/get-user-documents", authenticateToken, async (req, res) => {
//   const { user } = req.user;

//   try {
//     const documents = await Document.find({ userId: user._id });
//     if (!documents || documents.length === 0) {
//       return res
//         .status(404)
//         .json({ error: true, message: "No documents found" });
//     }

//     return res.json({
//       error: false,
//       documents, // เปลี่ยนจาก "document" เป็น "documents"
//       message: "User documents retrieved successfully",
//     });
//   } catch (error) {
//     console.error("Error retrieving documents:", error);
//     return res.status(500).json({
//       error: true,
//       message: "Internal Server Error",
//     });
//   }
// });

// Get Document Details by ID
app.get(
  "/get-document-details/:documentId",
  authenticateToken,
  async (req, res) => {
    const documentId = req.params.documentId;

    try {
      const document = await Document.findById(documentId);

      if (!document) {
        return res.status(404).json({
          error: true,
          message: "Document not found",
        });
      }

      return res.json({
        error: false,
        document,
        message: "Document retrieved successfully",
      });
    } catch (error) {
      console.error("Error retrieving document details:", error);
      return res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  }
);

// API for add Advisor
app.use("/api/admin", adminRouter);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

module.exports = app;
