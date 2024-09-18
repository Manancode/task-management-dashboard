// components/TaskList.tsx
import React from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task._id}>
          <CardHeader>
            <CardTitle>{task.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{task.description}</p>
            <div className="mt-2 flex justify-between items-center">
              <Badge variant={getStatusVariant(task.status)}>{task.status}</Badge>
              <div>
                <Button variant="outline" size="sm" onClick={() => onEdit(task)} className="mr-2">
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(task._id)}>
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

function getStatusVariant(status: string): "default" | "secondary" | "destructive" {
  switch (status) {
    case 'To Do':
      return "default";
    case 'In Progress':
      return "secondary";
    case 'Completed':
      return "destructive";
    default:
      return "default";
  }
}

export default TaskList;