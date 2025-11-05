// src/Portfolio.js - SECURE VERSION (No secrets in frontend!)
import React, { useState } from 'react';
import './Portfolio.css';

// Backend API URL - Only public URL, no secrets!
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ========================================
// YOUR DATA - EDIT THIS SECTION WITH YOUR INFO
// ========================================
const DATA = {
  personal: {
    name: "Aakarshit Rajs",
    title: "Full Stack Developer",
    subtitle: "MERN Stack Specialist",
    about: [
      "I'm a passionate Full Stack Developer with expertise in building scalable web applications. With a strong foundation in the MERN stack, I create solutions that solve real-world problems.",
      "When I'm not coding, you'll find me exploring new technologies, contributing to open source, or sharing knowledge with the developer community."
    ],
    email: "your.email@example.com",
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
    resumeUrl: "/resume.pdf"
  },
  
  experiences: [
    {
      position: "Senior Full Stack Developer",
      company: "Tech Company Inc",
      duration: "Jan 2023 - Present",
      location: "Remote",
      description: "Leading development of scalable web applications using MERN stack. Mentoring junior developers and implementing best practices."
    },
    {
      position: "Full Stack Developer",
      company: "Startup XYZ",
      duration: "Jun 2021 - Dec 2022",
      location: "New York, NY",
      description: "Built and maintained multiple client projects. Improved application performance by 40% through optimization."
    }
  ],
  
  projects: [
    {
      title: "E-commerce Platform",
      description: "Full-stack online store with cart, payment integration, and admin dashboard.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      github: "https://github.com/yourusername/project1",
      live: "https://demo.com"
    },
    {
      title: "Task Management App",
      description: "Real-time collaborative task tracker with drag-and-drop functionality.",
      technologies: ["React", "Firebase", "Material-UI"],
      github: "https://github.com/yourusername/project2",
      live: "https://demo.com"
    }
  ],
  
  skills: [
    {
      category: "Frontend",
      items: ["React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS"]
    },
    {
      category: "Backend",
      items: ["Node.js", "Express", "MongoDB", "PostgreSQL", "REST APIs"]
    },
    {
      category: "Tools",
      items: ["Git", "Docker", "AWS", "Vercel", "Figma", "Postman"]
    }
  ]
};

function Portfolio() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('');

  const scrollToSection = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Submit contact form via backend API (no secrets exposed!)
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactForm)
      });

      const data = await response.json();

      if (data.success) {
        setFormStatus('success');
        setContactForm({ name: '', email: '', message: '' });
        setTimeout(() => setFormStatus(''), 5000);
      } else {
        setFormStatus('error');
        setTimeout(() => setFormStatus(''), 5000);
      }
    } catch (error) {
      console.error('Error:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus(''), 5000);
    }
  };

  const handleInputChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  return (
    <div className="portfolio">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <h2 className="logo">{DATA.personal.name}</h2>
          
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>

          <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
            {['home', 'about', 'experience', 'projects', 'skills', 'contact'].map(section => (
              <li key={section}>
                <button
                  className={activeSection === section ? 'active' : ''}
                  onClick={() => scrollToSection(section)}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Hi, I'm <span className="highlight">{DATA.personal.name}</span>
          </h1>
          <p className="hero-subtitle">{DATA.personal.title} | {DATA.personal.subtitle}</p>
          <p className="hero-description">
            I build exceptional digital experiences with modern web technologies
          </p>
          <div className="hero-buttons">
            <button onClick={() => scrollToSection('projects')} className="btn-primary">
              View My Work
            </button>
            <a 
              href={DATA.personal.resumeUrl} 
              download="Resume.pdf"
              className="btn-secondary"
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              📄 Download Resume
            </a>
            <button onClick={() => scrollToSection('contact')} className="btn-secondary">
              Get In Touch
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="container">
          <h2 className="section-title">About Me</h2>
          <div className="about-content">
            {DATA.personal.about.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
            <div className="resume-download-section">
              <a 
                href={DATA.personal.resumeUrl} 
                download="Resume.pdf"
                className="btn-primary"
              >
                📥 Download My Resume
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="section bg-dark">
        <div className="container">
          <h2 className="section-title">Experience</h2>
          <div className="timeline">
            {DATA.experiences.map((exp, idx) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-content">
                  <h3>{exp.position}</h3>
                  <h4>{exp.company}</h4>
                  <p className="duration">{exp.duration} • {exp.location}</p>
                  <p>{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section">
        <div className="container">
          <h2 className="section-title">Featured Projects</h2>
          <div className="projects-grid">
            {DATA.projects.map((project, idx) => (
              <div key={idx} className="project-card">
                <div className="project-image">
                  <div className="project-placeholder">{project.title}</div>
                </div>
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="technologies">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  <div className="project-links">
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      GitHub →
                    </a>
                    <a href={project.live} target="_blank" rel="noopener noreferrer">
                      Live Demo →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section bg-dark">
        <div className="container">
          <h2 className="section-title">Skills & Technologies</h2>
          <div className="skills-grid">
            {DATA.skills.map((skillSet, idx) => (
              <div key={idx} className="skill-category">
                <h3>{skillSet.category}</h3>
                <div className="skill-tags">
                  {skillSet.items.map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-content">
            <p className="contact-description">
              I'm currently looking for new opportunities. Whether you have a question or just want to say hi,
              I'll try my best to get back to you!
            </p>
            
            <div className="contact-form-wrapper">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={contactForm.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={contactForm.email}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                value={contactForm.message}
                onChange={handleInputChange}
                required
              />
              <button
                onClick={handleContactSubmit}
                className="btn-primary"
                disabled={formStatus === 'sending'}
              >
                {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </div>

            {formStatus === 'success' && (
              <div className="notification success">
                ✓ Message sent successfully! I'll get back to you soon.
              </div>
            )}
            {formStatus === 'error' && (
              <div className="notification error">
                ✗ Failed to send. Please try again or email me directly.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 {DATA.personal.name}. Built with MERN Stack</p>
        <div className="social-links">
          <a href={DATA.personal.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={DATA.personal.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={`mailto:${DATA.personal.email}`}>Email</a>
        </div>
      </footer>
    </div>
  );
}

export default Portfolio;