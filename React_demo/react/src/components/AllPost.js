import React, { useState, useEffect } from "react";
import { getPosts } from "../data/manage.repository";
import MyPost from "./MyComment"

export default function Forum(props) {
  //load posts
  //1.set load state 2.set posts from ajax 3.set signal，control the post state deeply
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [signal, setSignal] = useState(0);

  async function loadPosts() {
    setIsLoading(true);
    const currentPosts = await getPosts();    
    setPosts(currentPosts);
    setIsLoading(false);
  }
  
  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div>
      <h1>AllPosts</h1>
      <div>
        {posts.map((post, i) => {
          return (
            <MyPost data={post} key={i} loadPosts={loadPosts} signal={signal} setSignal={setSignal}/>
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
