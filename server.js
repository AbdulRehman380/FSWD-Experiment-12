
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

const Project = require("./Project");
const Contact = require("./Contact");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5107;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// CREATE Project
app.post("/api/projects", async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ All Projects
app.get("/api/projects", async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ Single Project
app.get("/api/projects/:id", async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// UPDATE Project
app.put("/api/projects/:id", async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id, req.body, { new: true, runValidators: true }
        );
        if (!project) return res.status(404).json({ message: "Project not found" });
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE Project
app.delete("/api/projects/:id", async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });
        res.json({ message: "Project deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// CREATE Contact
app.post("/api/contact", async (req, res) => {
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json({ message: "Message received", contact });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ Contacts
app.get("/api/messages", async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Connect MongoDB and Start Server
async function startServer() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in .env");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Server Error:", err.message);
        process.exit(1);
    }
}

startServer();
