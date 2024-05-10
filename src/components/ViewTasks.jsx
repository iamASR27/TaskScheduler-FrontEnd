/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { List, Spin, Button, Checkbox, Select, Input } from "antd";
import VirtualList from "rc-virtual-list";
import "../styles/ViewTasks.scss";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import useFetchData from "../CustomHook/useFetchData";

const { Option } = Select;
const ContainerHeight = 400;

const ViewTasks = ({ data, loading, setData }) => {
  const [buttonSize, setButtonSize] = useState("middle");
  const [filter, setFilter] = useState("all");
  const [sortCriteria, setSortCriteria] = useState("none");
  const [searchQuery, setSearchQuery] = useState("");

  const { deleteTask, editTask } = useFetchData();

  const navigate = useNavigate();

  const handleEditClick = (item) => {
    navigate("/", { state: { item } });
  };

  const handleDelete = (id) => {
    deleteTask(id);
    setData((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleCheckboxChange = async(item, checked) => {
    const updateTask = await editTask({...item, completed: checked}, item.id);

    setData((prevTask) => {
        const updatedTask = [...prevTask];
        const updateIndex = prevTask.findIndex(
          (data) => data.id === updateTask.id
        );

        if (updateIndex !== -1) {
          updatedTask[updateIndex] = updateTask;
        }
        return updatedTask;
      });
    // setData((prevTasks) =>
    //   prevTasks.map((task) =>
    //     task.id === item.id ? { ...task, completed: checked } : task
    //   )
    // );
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setButtonSize("small");
      } else {
        setButtonSize("middle");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredData = data?.filter((item) => {
    if (filter === "all") return true;
    if (filter === "completed") return item.completed;
    if (filter === "incomplete") return !item.completed;
    return item.priority === filter;
  }).filter((item) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };

    const priorityA = priorityOrder[a.priority];
    const priorityB = priorityOrder[b.priority];

    if (sortCriteria === "priority") {
        if (priorityA < priorityB) {
            return -1;
          } else if (priorityA > priorityB) {
            return 1;
          } else {
            return 0
          }
    } else if (sortCriteria === "deadline") {
      return dayjs(a.deadline).unix() - dayjs(b.deadline).unix();
    }
    return 0;
  });

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
        <Input
        placeholder="Search by title or description"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "1rem" }}
      />
    <span>Filter:</span>{" "}
      <Select
        defaultValue="all"
        style={{ width: 120, marginBottom: 16, marginRight: 10 }}
        onChange={(value) => setFilter(value)}
      >
        <Option value="all">All</Option>
        <Option value="completed">Completed</Option>
        <Option value="incomplete">Incomplete</Option>
        <Option value="low">Low Priority</Option>
        <Option value="medium">Medium Priority</Option>
        <Option value="high">High Priority</Option>
      </Select>
      <span>Sort By:</span>{" "}
      <Select
          defaultValue="none"
          style={{ width: 120 }}
          onChange={(value) => setSortCriteria(value)}
        >
          <Option value="none">None</Option>
          <Option value="priority">Priority</Option>
          <Option value="deadline">Deadline</Option>
        </Select>
    <List>
      {sortedData.length > 0 ? (
        <VirtualList
          data={sortedData}
          height={ContainerHeight}
          itemHeight={47}
          itemKey={(item) => item.id}
        >
          {(item) => (
            <List.Item key={item.id} className="list-item">
            <div className="list-item-div">
              <Checkbox
                checked={item.completed}
                onChange={(e) =>
                  handleCheckboxChange(item, e.target.checked)
                }
                style={{marginRight: '2rem'}}
              />
              <List.Item.Meta
                title={item.title}
                description={item.description}
                className="list-meta"
                style={{marginRight: '2rem'}}
              />
              </div>
              <div className="outer-list-container">
              <div className="inner-list-container">
                <div className="list-details">
                  <div>
                    Deadline: {dayjs(item.deadline).format("DD/MM/YYYY")}
                  </div>
                  <div>Priority: {item.priority}</div>
                </div>
              </div>
              <div className="list-actions">
                <Button
                  type="primary"
                  size={buttonSize}
                  onClick={() => handleEditClick(item)}
                >
                  Edit
                </Button>
                <Button
                  danger
                  size={buttonSize}
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </Button>
              </div>
              </div>
            </List.Item>
          )}
        </VirtualList>
      ) : (
        <div style={{ textAlign: "center", padding: "20px" }}>
          No tasks found
        </div>
      )}
    </List>
    </div>
  );
};

export default ViewTasks;
