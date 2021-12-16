import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom"
import { createPost } from "../data/user.repository";
import { deletePost, getPosts } from "../data/manage.repository";
import MyUpload from "./MyUpload"
import MyPost from "./MyComment"
import { Button } from "antd";
import "./Forum.css"
//Forum and dependent methods realized
export default function Forum(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [imageUrl, setImgUrl] = useState(null);
  const [posts, setPosts] = useState([]);
  const [signal, setSignal] = useState(0);

  async function loadPosts() {
    //loading first
    setIsLoading(true);
    //read posts
    const currentPosts = await getPosts("self");
    //   
    setPosts(currentPosts);
    setIsLoading(false);
  }
  
  useEffect(() => {
    loadPosts();
  }, []);

  const handleInputChange = (event) => {
    setPost(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedPost = post.trim();

    if(trimmedPost === "") {
      setErrorMessage("A post cannot be empty.");
      return;
    } else if(trimmedPost.length > 600) {
      setErrorMessage("A post cannot be longer than 600.");
      return;
    }

    const newPost = { text: trimmedPost, username: props.user.username, imgUrl: imageUrl };
    await createPost(newPost);
    setImgUrl(null);
    loadPosts();
    setPost("");
    setErrorMessage("");
  };

  // const onEdit = (post) => {

  // }

  const onDelete = async (post_id) => {
    await deletePost(post_id);
    loadPosts();
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>New Post</legend>
          <MyUpload imageUrl={imageUrl} setImgUrl={setImgUrl}/>
          <div className="form-group">
            <textarea name="post" id="post" className="form-control" rows="3"
              value={post} onChange={handleInputChange} />
          </div>
          {errorMessage !== null &&
            <div className="form-group">
              <span className="text-danger">{errorMessage}</span>
            </div>
          }
          <div className="form-group">
            <input type="button" className="btn btn-danger mr-5" value="Cancel"
              onClick={() => { setPost(""); setErrorMessage(null); }} />
            <input type="submit" className="btn btn-primary" value="Post" />
          </div>
        </fieldset>
      </form>
      <hr/>
      <h1>Forum</h1>
      <div>
        {posts.map((post, i) => {
          return (
              <div className="ctn">
                <div>                
                  <MyPost data={post} key={i} loadPosts={loadPosts} signal={signal} setSignal={setSignal}/>
                </div>
                <div className="ctn ctn-action">
                  <Link onClick={()=>onEdit(post)} to={"/editpost/"+post.post_id}><Button>Edit</Button></Link>
                  <Button onClick={()=>onDelete(post.post_id)}>Delete</Button>
                </div>
                
              </div>
          )
        })}
        
        {isLoading ?
          <div>Loading posts...</div>
          : ""
        }
      </div>
   
    </div>
  );
}
