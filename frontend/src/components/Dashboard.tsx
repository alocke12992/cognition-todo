import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Checkbox, Spinner } from '@heroui/react';
import { Todo } from '../types/Todo';

function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/todos');
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleTodoComplete = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: !completed })
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const updatedTodo = await response.json();
      setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardBody>
            <p className="text-red-500">Error: {error}</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Todo Dashboard</h1>
        <p className="text-gray-600">
          {completedCount} of {todos.length} tasks completed
        </p>
      </div>

      <div className="space-y-4">
        {todos.map(todo => (
          <Card key={todo.id} className="w-full">
            <CardBody>
              <div className="flex items-start gap-4">
                <Checkbox
                  isSelected={todo.completed}
                  onValueChange={() => toggleTodoComplete(todo.id, todo.completed)}
                  size="lg"
                  className="mt-1"
                />
                <div className="flex-1">
                  <h3
                    className={`text-lg font-semibold ${
                      todo.completed ? 'line-through text-gray-400' : ''
                    }`}
                  >
                    {todo.title}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      todo.completed ? 'line-through text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {todo.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(todo.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}

        {todos.length === 0 && (
          <Card>
            <CardBody>
              <p className="text-center text-gray-500">No todos found</p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
