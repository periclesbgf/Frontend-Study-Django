import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Eden AI</h1>
      <p>
        Eden AI is a platform that connects students and teachers for personalized learning experiences.
      </p>
      <div className="links-container">
        <Link className="custom-link" to="/register-student">Register as a Student</Link>
        <Link className="custom-link" to="/register-teacher">Register as a Teacher</Link>
        <Link className="custom-link" to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Home;
