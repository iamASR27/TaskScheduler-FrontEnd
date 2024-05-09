/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { List, Spin, Button } from "antd";
import VirtualList from "rc-virtual-list";
import "../styles/ViewTasks.scss";
import { useNavigate } from "react-router-dom";
import moment from 'moment';

const ContainerHeight = 400;

const ViewTasks = ({ data, loading }) => {
  const [buttonSize, setButtonSize] = useState("middle");

  const navigate = useNavigate();

  const handleEditClick = (item) => {
    // console.log(item)
    // console.log(typeof item.deadline)
    // console.log(item.deadline);
    const formattedDeadline = new Date(item.deadline);
    console.log(typeof formattedDeadline)

    const editedItem = { ...item, deadline: formattedDeadline };
    navigate("/", { state: { item: editedItem } });
    //navigate("/", { state: { item } });
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

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <List>
      {data.length > 0 ? (
        <VirtualList
          data={data}
          height={ContainerHeight}
          itemHeight={47}
          itemKey="task"
        >
          {(item) => (
            <List.Item key={item.id} className="list-item">
              <List.Item.Meta
                title={item.title}
                description={item.description}
                className="list-meta"
              />
              <div className="list-container">
                <div className="list-details">
                  <div>
                    Deadline:{" "}
                    {moment(item.deadline).format("DD/MM/YYYY")}
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
                <Button danger size={buttonSize}>
                  Delete
                </Button>
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
  );
};

export default ViewTasks;
