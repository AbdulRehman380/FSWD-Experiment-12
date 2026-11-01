import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

function App() {
    const [projects, setProjects] = useState([]);
    const [title, setTitle] = useState("");
    const [stack, setStack] = useState("");
    const [projectsError, setProjectsError] = useState("");

    const loadProjects = async () => {
        try {
            const res = await fetch("/api/projects");
            if (!res.ok) {
                throw new Error("Unable to load projects.");
            }
            const data = await res.json();
            setProjects(data);
            setProjectsError("");
        } catch (err) {
            console.error(err);
            setProjectsError("Could not load projects. Check that the server and MongoDB are running.");
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const addProject = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: title.trim(), stack: stack.trim(), rating: 5 })
            });
            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.error || "Unable to add project.");
            }

            setTitle("");
            setStack("");
            await loadProjects();
        } catch (err) {
            console.error(err);
            alert(err.message || "Unable to add project.");
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();

        const data = {
            name: e.target.name.value,
            email: e.target.email.value,
            message: e.target.message.value
        };

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.error || "Unable to send message.");
            }

            alert(result.message || "Message received");
            e.target.reset();
        } catch (err) {
            console.error(err);
            alert(err.message || "Unable to send message.");
        }
    };

    return (
        <div className="container">
            <header>
                <h1>My Portfolio</h1>
                <p>React + Node.js + Express + MongoDB</p>
            </header>

            <section>
                <h2>Add Project</h2>

                <form onSubmit={addProject}>
                    <input
                        placeholder="Project Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />

                    <input
                        placeholder="Technology Stack"
                        value={stack}
                        onChange={e => setStack(e.target.value)}
                    />

                    <button type="submit">Add Project</button>
                </form>
            </section>

            <section>
                <h2>My Projects</h2>

                {projectsError && <p role="alert">{projectsError}</p>}
                {projects.map(project => (
                    <div className="card" key={project._id}>
                        <h3>{project.title}</h3>
                        <p>{project.stack}</p>
                        <p>Rating: {project.rating}/5</p>
                    </div>
                ))}
            </section>

            <section>
                <h2>Contact Me</h2>

                <form onSubmit={sendMessage}>
                    <input name="name" placeholder="Your Name" required />
                    <input name="email" type="email" placeholder="Your Email" required />
                    <textarea name="message" placeholder="Your Message" minLength="10" required />
                    <button type="submit">Send Message</button>
                </form>
            </section>
        </div>
    );
}

createRoot(document.getElementById("root")).render(<App />);