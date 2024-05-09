/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, Select } from "antd";
import useFetchData from "../CustomHook/useFetchData";
import "../styles/AddTask.scss";
import { useLocation } from "react-router-dom";

const { Option } = Select;

const AddTask = ({setData}) => {
  const [form] = Form.useForm();
  const [itemData, setItemData] = useState([]);

  const location = useLocation();

  const {postTask, editTask} = useFetchData();

  useEffect(() => {
    const item = location.state?.item || [];
    setItemData(item);
    if (Object.keys(item).length > 0) {
      form.setFieldsValue(item);
    }
  }, [location.state?.item]);

// useEffect(() => {
//     const item = location.state?.item || [];
//     setItemData(item);
//     if (Object.keys(item).length > 0) {
//       // Check if deadline is a valid date object (optional)
//       if (item.deadline instanceof Date && !isNaN(item.deadline.getTime())) {
//         form.setFieldsValue(item);
//       } else {
//         console.error("Invalid deadline format in edited task");
//       }
//     }
//   }, [location.state?.item]);

  const onFinish = async (values) => {
    console.log("Received values:", values);
    console.log(typeof values.deadline);

    if(itemData.length > 0){
        const addTask = await postTask(values);
        // console.log(addTask)
        setData((prevTask) => [{id: addTask.name, ...values }, ...prevTask]);
        // console.log({id: addTask.name, ...values })
    } else {
        const updateTask = await editTask(itemData, itemData.id);

        setData((prevTask) => {
            const updatedTask = [...prevTask];
            const updateIndex = prevTask.findIndex((item) => item.id === updateTask.id);

            if (updateIndex !== -1) {
                updatedTask[updateIndex] = updateTask;
              }
              return updatedTask;
        })

        form.resetFields();

        setItemData([]);

    }



    // try {
    //   const res = await fetch(
    //     "https://task-scheduler-8b672-default-rtdb.firebaseio.com/tasks.json",
    //     {
    //       method: "POST",
    //       body: JSON.stringify(values),
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    //   if (!res.ok) {
    //     throw new Error("Error adding task to server");
    //   }
    // } catch (error) {
    //   console.error("Error: ", error);
    // }

    form.resetFields();
  };

  return (
    <div className="form-container">
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="add-task-form"
      >
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Deadline"
          name="deadline"
          rules={[{ required: true }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="Priority"
          name="priority"
          rules={[{ required: true }]}
        >
          <Select>
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
          {Object.keys(itemData).length > 0 ? "Save Task" : "Add Task"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default  AddTask;
