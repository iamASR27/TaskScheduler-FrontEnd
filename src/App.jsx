import { useState, useEffect } from 'react';
import { Layout, Menu, theme } from 'antd';
import {Routes, Route, useNavigate} from 'react-router-dom';
import AddTask from './components/AddTask';
import ViewTasks from './components/ViewTasks';
import useFetchData from './CustomHook/useFetchData';
import './App.scss';

const { Header, Content, Footer, Sider } = Layout;

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
  const [selectedKey, setSelectedKey] = useState('1');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const {getAllTasks} = useFetchData();
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchTasks = async() => {
    const tasks = await getAllTasks();
    setData(tasks);
  }

  useEffect(() => {
    if(loading) {
      fetchTasks();
      setLoading(false);
    }
    
  }, [])
  
  const navigate = useNavigate();

  const handleClick = (item) => {
    setSelectedKey(item.key);
    navigate(item.item.props.path);
    // console.log(item.item.props.path)
    // console.log('navigate', item.item.props.path)
    // if (item.key === '1') {
    //   navigate('/'); 
    // } else {
    //   navigate(`/${item.key.toLowerCase()}`); 
    // }
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
             <Routes>
              <Route path="/" element={<AddTask setData={setData}/>} />
              <Route path="/view-tasks" element={<ViewTasks data={data} loading={loading} setData={setData}/>} />
             
            </Routes>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default App;