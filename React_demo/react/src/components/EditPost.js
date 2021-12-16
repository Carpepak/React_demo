import React, { useState, useEffect } from "react";
import {  getPost, updatePost } from "../data/user.repository";
import MyUpload from "./MyUpload"
import { useHistory } from "react-router-dom";
//edit post 
function EditPost({post_id}) {
  const [post, setPost] = useState(null);
  const [text, setText] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [imageUrl, setImgUrl] = useState(null);
  const history = useHistory();

  useEffect(()=> {
    const loadPost = async() => {
      const currentPost = await getPost(post_id);
      setPost(currentPost);
      setText(currentPost.text);
    }
    loadPost();
  }, [post_id]);
//get text 
  const handleInputChange = (event) => {
    post.text = event.target.value;
    setPost(post);
    setText(post.text);
  };

  const handleSubmit = async (event) => {
    //prevent submit of form 
    event.preventDefault();
    const trimmedPost = text.trim();
    //if trim post is empty,negative,and post length
    if(trimmedPost === "") {
      setErrorMessage("A post cannot be empty.");
      return;
    } else if(trimmedPost.length > 600) {
      setErrorMessage("A post cannot be longer than 600.");
      return;
    }
    //post img options
    post.imgUrl = imageUrl;
    const currentPost = await updatePost(post);
    setImgUrl(null);
    setPost(currentPost);
    setText("");
    setErrorMessage("");
    history.push("/forum");
  };
  //return posts if post exists otherwise return ''
  return (
    <div>
      {
        post?
        <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>New Post</legend>
          <MyUpload imageUrl={imageUrl} setImgUrl={setImgUrl}/>
          <div className="form-group">
            <textarea name="post" id="post" className="form-control" rows="3"
              value={post.text} onChange={handleInputChange} />
          </div>
          {errorMessage !== null &&
            <div className="form-group">
              <span className="text-danger">{errorMessage}</span>
            </div>
          }
          <div className="form-group">
            <input type="button" className="btn btn-danger mr-5" value="Cancel"
              onClick={() => { history.push("/forum"); setErrorMessage(null); }} />
            <input type="submit" className="btn btn-primary" value="Post" />
          </div>
        </fieldset>
      </form>
      :
      ""
      }
      
    </div>
  );
}

export default EditPost;
