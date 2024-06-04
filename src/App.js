// src/App.js
import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import 'tailwindcss/tailwind.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

let baseURL = 'https://goblinpowered.com';
if (process.env.NODE_ENV === 'production') {
  baseURL = '';
}

const App = () => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetch(`${baseURL}/projects.json`)
      .then(response => response.json())
      .then(data => setSections(data.sections));
  }, []);

  function resolveUrl(media) {
    if (media.startsWith('http://') || media.startsWith('https://')) {
      return media;
    } else {
      return `${baseURL}/${media}`;
    }
  }

  const videoRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.play();
        } else {
          entry.target.pause();
        }
      });
    }, { threshold: 0.25 });

    videoRefs.current.forEach(video => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach(video => {
        if (video) observer.unobserve(video);
      });
    };
  }, [sections]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <nav className="bg-gray-800 p-4 fixed w-full z-10 top-0 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <a className="flex items-center text-2xl font-bold" href="#"><img className="w-8 h-8 mr-2" src={"logo192.png"} alt="Logo" style={{ filter: "grayscale(1) brightness(5.5)" }} />Goblin Powered</a>
          <div className="space-x-4">
            <a className="hover:text-gray-400" href="#">Home</a>
            <a className="hover:text-gray-400" href="#">About</a>
            <a className="text-gray-500" href="#">Log In</a>
          </div>
        </div>
      </nav>

      <div className="pt-16 h-screen bg-cover bg-center" style={{ backgroundImage: "url('bgimg.webp')" }}>
        <div className="container mx-auto flex pt-4">
          <div className="w-3/4 pr-4">
            {sections.filter(section => section.title === 'Featured Projects').map((section, sectionIndex) => (
              <section key={sectionIndex} className="h-full">
                <h2 className="text-4xl font-bold text-center mb-6 underline project-title">{section.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {section.projects.map((project, projectIndex) => (
                    <div key={projectIndex} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg pb-3 hover:scale-105 transform transition duration-150">
                      <a href={project.link}>
                        {project.media_type === 'video' ? (
                          <video
                            ref={el => videoRefs.current[sectionIndex * 3 + projectIndex] = el}
                            className="w-full"
                            src={resolveUrl(project.media)}
                            muted
                            loop
                            autoPlay
                          ></video>
                        ) : project.media_type === 'fontawesome' ? (
                          <div className="flex items-center justify-center h-64">
                            <i className={`${project.media} text-6xl`}></i>
                          </div>
                        ) : (
                          <img className="w-full" src={resolveUrl(project.media)} alt={project.title} />
                        )}
                      </a>
                      <div className="p-2 pl-4">
                        <h3 className="text-2xl font-bold underline project-title mb-2">{project.title}</h3>
                        <p className='pl-1 pr-1'>{project.description}</p>
                        {project.github && (
                          <div className="pt-2">
                            <a href={project.github} className="text-gray-400 hover:text-gray-200">
                              <i className="fab fa-github text-xl"></i>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <div className="w-1/4 pl-4">
            {sections.filter(section => section.title !== 'Featured Projects').map((section, sectionIndex) => (
              <section key={sectionIndex} className="h-full">
                <h2 className="text-2xl font-bold mb-4 underline project-title">{section.title}</h2>
                <div className="space-y-4">
                  {section.projects.map((project, projectIndex) => (
                    <div key={projectIndex} className="flex items-center bg-gray-800 rounded-lg overflow-hidden shadow-lg p-2 hover:scale-105 transform transition duration-150">
                      <a href={project.link} className="flex items-center">
                        {project.media_type === 'video' ? (
                          <video
                            className="w-12 h-12"
                            src={resolveUrl(project.media)}
                            muted
                            loop
                            autoPlay
                          ></video>
                        ) : project.media_type === 'fontawesome' ? (
                          <div className="flex items-center justify-center h-12 w-12">
                            <i className={`${project.media} text-xl text-center min-w-12`}></i>
                          </div>
                        ) : (
                          <img className="w-12 h-12" src={resolveUrl(project.media)} alt={project.title} />
                        )}
                        <div className="ml-4">
                          <h3 className="text-lg font-bold underline">{project.title}</h3>
                          <p className="text-sm">{project.description}</p>
                          {project.github && (
                            <div className="pt-2">
                              <a href={project.github} className="text-gray-400 hover:text-gray-200">
                                <i className="fab fa-github text-xl"></i>
                              </a>
                            </div>
                          )}
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 p-4 text-center">
        <p>&copy; 2024 Goblin Powered. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
