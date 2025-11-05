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
    name: "Aakarshit Raj",
    title: "Full Stack Developer",
    subtitle: "MERN Stack Specialist",
    about: [
  "I’m a System Engineer and Full Stack Developer at Tata Consultancy Services (TCS), specializing in building scalable, secure, and high-performance web applications using the MERN stack.",
  "I’ve deployed enterprise-grade REST APIs on AWS, implemented CI/CD pipelines, and automated workflows to improve operational efficiency.",
  "I’m passionate about writing clean, maintainable code and continuously improving as a developer."
],
    email: "your.email@example.com",
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
    resumeUrl: "/resume.pdf"
  },
  
experiences: [
  {
    position: "System Engineer (Full Stack Developer – MERN)",
    company: "Tata Consultancy Services (TCS)",
    duration: "June 2024 – Present",
    location: "Bhubaneswar, India",
    description:
      "Developed and deployed full-stack enterprise web applications for a global banking client using the MERN stack. Built scalable REST APIs on AWS Lambda, integrated with Amazon API Gateway, and implemented CI/CD pipelines using AWS CodePipeline and Docker Enterprise."
  },
  {
    position: "Automation Developer",
    company: "Tata Consultancy Services (TCS)",
    duration: "2024 – Present",
    location: "Bhubaneswar, India",
    description:
      "Automated reporting workflows using Excel VBA Macros, reducing manual efforts and improving efficiency across departments."
  }
],
  
  projects: [
  {
    title: "Rent A Vehicle Website",
    description:
      "Full-stack vehicle rental platform using ReactJS, Node.js, Express, and MongoDB. Includes secure authentication, booking, and payment flow.",
    technologies: ["ReactJS", "Node.js", "Express.js", "MongoDB"],
    github: "https://github.com/AakarshitRaj/Rent-a-vehicle-online/tree/master",
    live: "https://aakarshit-vehicle-rent.vercel.app"
  },
  {
    title: "Store App",
    description:
      "Responsive e-commerce store using React and Redux with dynamic API integration via Axios.",
    technologies: ["React", "Redux", "Axios", "Node.js"],
    github: "https://github.com/AakarshitRaj/Store/tree/main/Store",
    live: "https://aakarshit-store.vercel.app"
  }
],
  
  skills: [
  {
    category: "Frontend",
    items: ["ReactJS", "Redux", "JavaScript (ES6+)", "HTML5", "CSS3", "Tailwind CSS"]
  },
  {
    category: "Backend",
    items: ["Node.js", "Express.js", "MongoDB", "MySQL", "REST APIs"]
  },
  {
    category: "Cloud & DevOps",
    items: ["AWS (IAM, EC2, S3, Lambda)", "Docker", "CI/CD", "Kubernetes", "Vercel"]
  },
  {
    category: "Tools & Automation",
    items: ["Git", "GitHub", "Postman", "Excel VBA Macros", "Visual Studio Code"]
  }
],
achievements: [
  {
    title: "Xcelerate Warrior Recognition – Tata Consultancy Services (2025)",
    link: "" // leave blank if no link available
  },
  {
    title: "On the Spot (Team) Award – Tata Consultancy Services (2025)",
    link: ""
  },
  {
    title: "Best Team Award – Tata Consultancy Services (2025)",
    link: ""
  },
  {
    title: "Group Representative (GR) – TCS ILP 2024",
    link: "https://example.com/tcs-gr-certificate"
  },
  {
    title: "AWS Academy Graduate – Introduction to Cloud (AWS)",
    link: "https://www.credly.com/badges/aws-intro-cloud"
  },
  {
    title: "Building RESTful APIs with Node.js and Express – LinkedIn Learning",
    link: "https://www.linkedin.com/learning/certificates/your-link"
  },
  {
    title: "MongoDB Developer Certification – Udemy",
    link: "https://udemy-certificate-link"
  },
  {
    title: "React (Basic) Certificate – HackerRank",
    link: "https://www.hackerrank.com/certificates/your-link"
  }
],


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
            {['home', 'about', 'experience', 'projects', 'skills','achievements', 'contact'].map(section => (
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

{/* Achievements Section */}
<section id="achievements" className="section bg-dark">
  <div className="container">
    <h2 className="section-title gradient-text">🏆 Achievements & Certifications</h2>
    <div className="achievements-grid">
      {DATA.achievements.map((a, i) => (
        <div key={i} className="achievement-card">
          <span className="trophy">🏅</span>
          <p>
            {a.title}
            {a.link && (
              <>
                {" "}
                <a
                  href={a.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-cert-link"
                >
                  View Certificate →
                </a>
              </>
            )}
          </p>
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