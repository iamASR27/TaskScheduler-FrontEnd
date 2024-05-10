/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Form, Input, Button, DatePicker, Select } from "antd";
import useFetchData from "../CustomHook/useFetchData";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "../styles/AddTask.scss";

const { Option } = Select;

const AddTask = ({ setData, editState, setEditState }) => {
  const [form] = Form.useForm();
  // const [itemData, setItemData] = useState({});

  const location = useLocation();
  const navigate = useNavigate();

  const { postTask, editTask } = useFetchData();

  useEffect(() => {
    if (location.state?.item) {
      const item = location.state?.item;
      // const formattedDeadline = moment(item.deadline).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      //   const formattedDeadline = new Date(item.deadline).toISOString();
      const formattedDeadline = dayjs(item.deadline);

      // console.log(formattedDeadline);
      const updatedItem = { ...item, deadline: formattedDeadline };
      // setItemData(updatedItem);

      form.setFieldsValue(updatedItem);
    }
  }, [location.state?.item, form]);

  const onFinish = async (values) => {
    // console.log("Received values:", values);
    // console.log(typeof values.deadline);

    if (editState.status) {
      const updateTask = await editTask(values, editState.editData.id);
      console.log(updateTask)
      setData((prevTask) => {
        const updatedTask = [...prevTask];
        const updateIndex = prevTask.findIndex(
          (item) => item.id === updateTask.id
        );

        if (updateIndex !== -1) {
          updatedTask[updateIndex] = updateTask;
        }
        return updatedTask;
      });

      setEditState({ status: false, editData: null });

      navigate("/");
    } else {
      const addTask = await postTask(values);
    //   console.log(addTask)
      setData((prevTask) => [{ id: addTask.name, ...values, completed: false }, ...prevTask]);
      // console.log({id: addTask.name, ...values })
      //   form.resetFields();

      //   setItemData({});
    }

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
            {editState.status ? "Save Task" : "Add Task"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddTask;
