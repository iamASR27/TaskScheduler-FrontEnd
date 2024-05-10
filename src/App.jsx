import { useState, useEffect, lazy, Suspense } from 'react';
import { Layout, Menu, theme, Spin } from 'antd';
import {Routes, Route, useNavigate} from 'react-router-dom';
// import AddTask from './components/AddTask';
// import ViewTasks from './components/ViewTasks';
import useFetchData from './CustomHook/useFetchData';
// import TaskReminder from './components/TaskReminder';
import './App.scss';

const { Header, Content, Footer, Sider } = Layout;

const AddTask = lazy(() => import('./components/AddTask'));
const ViewTasks = lazy(() => import('./components/ViewTasks'));
const TaskReminder = lazy(() => import('./components/TaskReminder'));

const items = [
  {
    key: '1',
    label: 'Add Task',
    path: '/'
  },
  {
    key: '2',
    label: 'View Tasks',
    path: '/view-tasks'
  },
  {
    key: '3',
    label: 'Task Reminders',
    path: '/task-reminders'
  },
];

const App = () => {
  const initialSelectedKey = localStorage.getItem('initialKey');
  const [selectedKey, setSelectedKey] = useState(initialSelectedKey ||'1');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const {getAllTasks} = useFetchData();
  
  const [data, setData] = useState([]);
  const [editState, setEditState] = useState({ status: false, editData: null });
  const [loading, setLoading] = useState(true);


  const fetchTasks = async() => {
    const tasks = await getAllTasks();
    setData(tasks);
  }

  useEffect(() => {
    // const initKey = localStorage.getItem('initialKey');
    // setSelectedKey(initKey);
    if(loading) {
      fetchTasks();
      setLoading(false);
    }
    
  }, [])
  
  const navigate = useNavigate();

  const handleClick = (item) => {
    setSelectedKey(item.key);
    localStorage.setItem("initialKey", item.key)
    navigate(item.item.props.path);
  };


  return (
    <Layout className='main-layout'>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        className='sider'
      >
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" /*defaultSelectedKeys={['1']}*/ selectedKeys={[selectedKey]} items={items} onClick={handleClick}/>
      </Sider>
      <Layout>
        <Header
          className="task-scheduler-heading"
        ><h1>Task Scheduler</h1></Header>
        <Content
          style={{
            margin: '24px 16px 0',
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
             <Suspense fallback={<Spin size="large" />}>
             <Routes>
              <Route path="/" element={<AddTask setData={setData} editState={editState} setEditState={setEditState}/>} />
              <Route path="/view-tasks" element={<ViewTasks data={data} loading={loading} setData={setData} setSelectedKey={setSelectedKey} setEditState={setEditState}/>} />
              <Route path='/task-reminders' element={<TaskReminder data={data}/>}/>
            </Routes>
            </Suspense>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Task Scheduler Created by Amardeep
        </Footer>
      </Layout>
    </Layout>
  );
};
export default App;