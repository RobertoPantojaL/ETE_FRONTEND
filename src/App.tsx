import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import TaskList from './components/TaskList';
import CreateTask from './components/CreateTask';
import Navbar from './components/Navbar';
import './styles/custom.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className="min-vh-100 d-flex flex-column">
        <Navbar 
          isAuthenticated={isAuthenticated} 
          onLogout={handleLogout}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
        <main className="flex-grow-1">
          <div className="container py-4">
            <Routes>
              <Route path="/login" element={
                isAuthenticated ? <Navigate to="/tasks" /> : <Login setIsAuthenticated={setIsAuthenticated} />
              } />
              <Route path="/tasks" element={
                isAuthenticated ? <TaskList /> : <Navigate to="/login" />
              } />
              <Route path="/create-task" element={
                isAuthenticated ? <CreateTask /> : <Navigate to="/login" />
              } />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;

