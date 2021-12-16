import { Comment, Tooltip, List, Form, Button, Input, Divider } from 'antd';
import React, { createElement, useEffect, useState } from 'react';
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from '@ant-design/icons';
import { toggleLike, toggleDislike, getComments, toggleFollow, isFollow, getStatus } from "../data/manage.repository"
import {createPost, getUser} from "../data/user.repository"
import "./MyComment.css"
const { TextArea } = Input;

const Editor = ({ setCommenting, post_id, loadComments }) => {
  //1.set value of post
  const [value, setValue] = useState("");
  //2.set submit state
  const [submitting, setSubmitting] = useState(false);
  const onChange = e => {
    setValue(e.target.value);
  }

  const onSubmit = async () => {
    setSubmitting(true);
    const newPost = { text: value.trim(), username: getUser().username, reply: post_id};
    await createPost(newPost);
    setSubmitting(false);
    await loadComments(post_id);
    setCommenting(false);
  }
  return(
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        Add Comment
      </Button>
    </Form.Item>
  </>)
  };

const MyComment = ({data, loadComments, loadPosts, signal, setSignal}) => {
  //when Dom rerender,release the posts and followed state
  const [commenting, setCommenting] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [status, setStatus] = useState(0);
  

  

  useEffect(() => {
    const loadFollowed = async () => {
      const currentFollowed = await isFollow(data.username);
      setFollowed(currentFollowed);
    }
  
    const loadStatus = async () => {
      const currentStatus = await getStatus(data.post_id);
      setStatus(currentStatus);
    }
    loadFollowed();
    loadStatus();
  }, [signal, data.post_id, data.username])
  //get counts of like and dislike
  const like = async () => {
    const like = await toggleLike(data.post_id, status);
    setStatus(parseInt(like.type));
    await loadPosts();
  };

  const dislike = async () => {
    const dislike = await toggleDislike(data.post_id, status);
    setStatus(parseInt(dislike.type));
    await loadPosts();
  };

  const toggleComment = () => {
    setCommenting(!commenting);
  }

  const follow = async () => {
    const currentFollow = await toggleFollow(data.username);
    setFollowed(currentFollow);
    await loadPosts();
    setSignal(signal+1);
  }

  

  const actions = [
    
    <Tooltip key="comment-basic-like" title="Like">
      <span onClick={like} className="span">
        {createElement(status === 1 ? LikeFilled : LikeOutlined)}
        <span className="comment-action">{data.likes}</span>
      </span>
    </Tooltip>,
    <Tooltip key="comment-basic-dislike" title="Dislike">
      <span onClick={dislike} className="span">
        {/* createReactEle status className =DislikeFilled/DislikeOutlined */}
        {React.createElement(status === -1 ? DislikeFilled : DislikeOutlined)}
        <span className="comment-action">{data.dislikes}</span>
      </span>
    </Tooltip>
    
  ];
  if(data.reply === -1) {
    actions.push(<span key="comment-basic-reply-to" onClick={toggleComment}>Reply to</span>);
  }


  return (
    <>
      <Comment
        actions={actions}
        author={
          <>
            <a href="/">{data.username}</a>
            {
              followed ?
              <Button className="btn followed" type="primary" size="small" onClick={follow} >followed</Button>
              :
              <Button className="btn" type="primary" size="small" onClick={follow} danger>+ follow</Button>
            }
          </>
        }
        content={
          <>
            <p>
              {data.text}
            </p>
            {data.imgUrl && <img src={data.imgUrl} alt="img" className="img"></img>}
          </>
        }
      />
      {commenting && (<Editor setCommenting={setCommenting} post_id={data.post_id} loadComments={loadComments}></Editor>)}
      <Divider></Divider>
    </>
  );
};

const Post = ({data, loadPosts, signal, setSignal}) => {
  const [comments, setComments] = useState(null);
//
  const loadComments = async (post_id) => {
    const currentComments = await getComments(post_id);
    setComments(currentComments);
  }

  useEffect(()=>{
    loadComments(data.post_id);
  }, [data.post_id])
//when comments not null ：1.unique comment，named reply2. multi comments， return replies
  return (
    <>
      <MyComment data={data} loadComments={loadComments} loadPosts={loadPosts} signal={signal} setSignal={setSignal}/>
      {comments && comments.length>0 &&
        <div className="list">
          <List
            dataSource={comments}
            header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
            itemLayout="horizontal"
            renderItem={(comment, i) => <MyComment data={comment} key={i} loadComments={loadComments} loadPosts={loadPosts} signal={signal} setSignal={setSignal}/>} 
          />
        </div>
      }
    </>
  )
}

export default Post;