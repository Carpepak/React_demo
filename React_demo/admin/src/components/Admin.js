import { Layout, Menu, Table, Space, Button  } from 'antd';
import { useEffect, useState } from 'react';
import {getUsers, getPosts, getFollows, deletePost, blockUser, deleteUser, getTimes, getCounts} from '../data/manage.repository'
import {useHistory} from "react-router-dom"
import "./Admin.css"
const { Content, Sider } = Layout;

const { Column } = Table;

const UserTable = ({data, onBlock, onDelete}) => {
  const history = useHistory();
  const onEdit = (username) => {
    history.push(`/edit/${username}`)
  }

  if(data === null)
    return null;
  return (
    <Table dataSource={data} rowKey={user => user.username}>
      <Column title="Username" dataIndex="username" key="username" />
      <Column title="First Name" key="first_name" dataIndex="first_name"/>
      <Column title="Last Name" key="last_name" dataIndex="last_name"/>
      <Column title="Email" key="email" dataIndex="email"/>
      <Column
        title="Action"
        key="action"
        render={user => (
          <Space size="middle">
            <Button onClick={()=>onBlock(user.username)}>Block</Button>
            <Button onClick={()=>onDelete(user.username)}>Delete</Button>
            <Button onClick={()=>onEdit(user.username)}>Edit</Button>
          </Space>
        )}
      />
    </Table>
  );
}

const PostTable = ({data, onDelete}) => {
  if(data === null)
    return null;
  return (
    <Table dataSource={data} rowKey={post => post.post_id} >
      <Column title="text" dataIndex="text" key="text" />
      <Column title="username" dataIndex="username" key="username" />
      <Column
        title="Action"
        key="action"
        render={post => (
          <Space size="middle">
            <Button onClick={()=>onDelete(post.post_id)}>Delete</Button>
          </Space>
        )}
      />
    </Table>
  );
}

const FollowTable = ({data}) => {
  if(data === null)
    return null;
  data.sort((a,b) => b.follows - a.follows);
  return (
    <Table dataSource={data} className="table" pagination={false} rowKey={follow => follow.username} >
      <Column title="username" dataIndex="username" key="username" />
      <Column title="follows" dataIndex="follows" key="follows"/>
    </Table>
  );
}

const PostStatisticsTable = ({data}) => {
  data.sort((a,b) => b.likes - a.likes)
  if(data === null)
    return null;
  return (
    <Table dataSource={data} style={{width: "400px"}} pagination={false} rowKey={post=>post.post_id}>
      <Column title="text" dataIndex="text" key="text" />
      <Column title="username" dataIndex="username" key="username" />
      <Column title="likes" dataIndex="likes" key="likes" />
      <Column title="dislikes" dataIndex="dislikes" key="dislikes" />
    </Table>
  );
}

const Mytable = ({data}) => {
  if(!data)
    return null;
  if(data.length === 0)
    return "no data";
  return (
    <Table dataSource={data} 
    style={{width: (Object.entries(data[0]).length*100)+"px"}} 
    pagination={false} rowKey={d=>d.id}>
      {Object.entries(data[0]).map(d => <Column title={d[0]} dataIndex={d[0]} key={d[0]} />)}
    </Table>
  )
}

const UserManager = () => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const currentUsers = await getUsers();
    setUsers(currentUsers);
  }

  const onBlock = async (username) => {
    await blockUser(username);
  }

  const onDelete = async (username) => {
    await deleteUser(username)
    await loadUsers();
  }

  return (
    <>
      <UserTable data={users} onBlock={onBlock} onDelete={onDelete}></UserTable>
    </>
  )
}

const PostManager = () => {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const currentPosts = await getPosts();
    setPosts(currentPosts);
  }

  const onDelete = async (post_id) => {
    await deletePost(post_id);
    await loadPosts();
  }

  return (
    <>
      <PostTable data={posts} onDelete={onDelete}></PostTable>
    </>
  )
}

const Statistics = () => {
  const [follows, setFollows] = useState(null);
  const [posts, setPosts] = useState(null);
  const [times, setTimes] = useState(null);
  const [counts, setCounts] = useState(null);
  const [key, setKey] = useState(2);
  useEffect(() => {
    loadFollows();
    loadPosts();
    loadTimes();
    loadCounts();
  }, []);

  const loadFollows = async () => {
    const currentFollows = await getFollows();
    setFollows(currentFollows);
  }

  const loadTimes = async () => {
    const currentTimes = await getTimes();
    currentTimes.forEach(time => {
      let t = time.time/1000;
      time.time = parseInt(t)%60 + "s";
      t /= 60;
      if(t>1) {
        time.time = parseInt(t)%60 +"m" + time.time;
      }
      t /= 60;
      if(t>1) {
        time.time = parseInt(t)%24 +"h" + time.time;
      }
      t /= 24;
      if(t>1) {
        time.time = parseInt(t) +"d" + time.time;
      }
    });
    setTimes(currentTimes);
  }

  const loadCounts = async () => {
    const currentCounts = await getCounts();
    setCounts(currentCounts);
  }

  const loadPosts = async () => {
    const currentPosts = await getPosts();
    setPosts(currentPosts);
  }

  const onclick = e => {
    setKey(parseInt(e.key));
  }

  return (
    <>
      <Menu onClick={onclick} selectedKeys={[key]} mode="horizontal">
        <Menu.Item key="2">
          follows
        </Menu.Item>
        <Menu.Item key="3">
          post
        </Menu.Item>
        <Menu.Item key="1">
          times
        </Menu.Item>
        <Menu.Item key="4">
          flow
        </Menu.Item>
      </Menu>
      
      {key===2 && <FollowTable data={follows}></FollowTable>}
      {key===3 && <PostStatisticsTable data={posts}></PostStatisticsTable>}
      {key===1 && <Mytable data={times}></Mytable>}
      {key===4 && <Mytable data={counts}></Mytable>}
    </>
  )
}


const Admin = () => {
  const [content, setContent] = useState(1);
  const handleClick = e => {
    setContent(parseInt(e.key));
  }

  const getContent = () => {
    switch (content) {
      case 1:
        return <UserManager></UserManager>;
      case 2:
        return <PostManager></PostManager>;
      case 3:
        return <Statistics></Statistics>;
      default:
        break;
    }
  }

  return (
    <>
    <Layout>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            onClick={handleClick}
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="1">Manage User</Menu.Item>
            <Menu.Item key="2">Manage Post</Menu.Item>
            <Menu.Item key="3">Statistics</Menu.Item>
          </Menu>
        </Sider>
        <Content className="content">
          {getContent()}
        </Content>
      </Layout>
    </Layout>
    </>
  )
}

export default Admin;