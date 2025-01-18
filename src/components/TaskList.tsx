import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';

interface Task {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  id_usuario: number;
}

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const tasksPerPage = 5;

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const filtered = tasks.filter(task => 
      task.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(filtered);
    setCurrentPage(1);
  }, [searchTerm, tasks]);

  const fetchTasks = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:3000/tareas`);
      const userTasks = response.data.filter((task: Task) => task.id_usuario === Number(userId));
      setTasks(userTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const updateTaskStatus = async (id: number, status: string) => {
    try {
      await axios.put(`http://localhost:3000/tareas/${id}`, { estado: status });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/tareas/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 300);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h2 className="mb-4">Task List</h2>
      <div className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
        <Link to="/create-task" className="btn btn-success mb-2 mb-md-0">
          Create New Task
        </Link>
        <input
        //placeholder adaptable alñ cambio de modo
        type="text"
        placeholder="Search by title or description"
        onChange={(e) => handleSearch(e.target.value)}
        className="form-control form-control-lg mb-2 mb-md-0 "

        style={{ maxWidth: '400px' }}
        />
      </div>
      <div className="row">
        {currentTasks.map((task) => (
          <div key={task.id} className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{task.titulo}</h5>
                <p className="card-text">{task.descripcion}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <select
                    value={task.estado}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                    className="form-select me-2"
                    style={{ maxWidth: '150px' }}
                  >
                    <option value="pendiente">Pending</option>
                    <option value="en progreso">In Progress</option>
                    <option value="completado">Completed</option>
                  </select>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <nav>
        <ul className="pagination justify-content-center">
          {Array.from({ length: Math.ceil(filteredTasks.length / tasksPerPage) }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => paginate(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default TaskList;

