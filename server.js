const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

const Project = require("./Project");
const Contact = require("./Contact");

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5107;

// Serve React Frontend
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

// READ Projects
app.get("/api/projects", async (req, res) => {
    try {
        res.json(await Project.find());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ Single Project
app.get("/api/projects/:id", async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Not found" });
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
        if (!project) return res.status(404).json({ message: "Not found" });
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE Project
app.delete("/api/projects/:id", async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ message: "Not found" });
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
        res.json(await Contact.find().sort({ createdAt: -1 }));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// START SERVER
async function startServer() {
    if (!process.env.MONGO_URI) {
        console.error("MongoDB is not configured. Copy .env.example to .env and set MONGO_URI.");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        app.listen(PORT, () => {
            console.log("Server running on http://localhost:" + PORT);
        });
    } catch (err) {
        console.error("MongoDB Error:", err.message);
        process.exit(1);
    }
}

startServer();