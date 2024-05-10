/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { List, Alert } from "antd";
import dayjs from "dayjs";

const TaskReminder = ({ data }) => {
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);

  const filterTasks = () => {
    const today = dayjs();
    const upcoming = [];
    const overdue = [];

    data.forEach((task) => {
      const deadline = dayjs(task.deadline);
      const daysRemaining = deadline.diff(today, "day");
      if (!task.completed) {
        if (deadline.isAfter(today, "day")) {
          upcoming.push({ ...task, daysRemaining });
        } else if (deadline.isBefore(today, "day")) {
          overdue.push(task);
        }
      }
    });

    setUpcomingTasks(upcoming);
    setOverdueTasks(overdue);
  };

  useEffect(() => {
    filterTasks();
  }, [data]);

  return (
    <div>
      <h2>Task Reminders</h2>
      <div>
        <h3>Upcoming Deadlines</h3>
        <List
          dataSource={upcomingTasks}
          renderItem={(task) => (
            <List.Item>
              <Alert
                message={task.title}
                description={`Deadline: ${dayjs(task.deadline).format(
                  "DD-MM-YYYY"
                )}, Days Remaining: ${task.daysRemaining}`}
                type="info"
              />
            </List.Item>
          )}
        />
      </div>
      <div>
        <h3>Overdue Tasks</h3>
        <List
          dataSource={overdueTasks}
          renderItem={(task) => (
            <List.Item>
              <Alert
                message={task.title}
                description={`Deadline: ${dayjs(task.deadline).format(
                  "DD-MM-YYYY"
                )}`}
                type="error"
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default TaskReminder;
