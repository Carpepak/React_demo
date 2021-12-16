import axios from "axios";
import { request, gql } from "graphql-request";
import {getUser} from "./user.repository"
const GRAPH_QL_URL = "http://localhost:4000/graphql";
const API_HOST = "http://localhost:4000";

async function getUsers() {
  const response = await axios.get(API_HOST + `/api/profiles`);

  return response.data;
}

async function getTimes() {
  const query = gql`
    {
      all_times {
        username,
        date,
        time
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query);
  return data.all_times;
}

async function getCounts() {
  const query = gql`
    {
      all_counts {
        date,
        num
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query);
  return data.all_counts;
}

async function getPosts() {
  const query = gql`
    {
      all_posts {
        text,
        username,
        post_id,
        reply,
        likes,
        dislikes,
        imgUrl
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query);
  return data.all_posts;
}
async function deletePost(post_id) {
  const query = `
  mutation ($post_id: Int) {
    delete_post(post_id: $post_id)
  }
  `;

const data = await request(GRAPH_QL_URL, query, {post_id});

return data.delete_post;
}

async function getComments(reply) {
  const query = gql`
    query ($reply: Int) {
      all_comments(reply: $reply) {
        text,
        username,
        post_id
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query, {reply});
  return data.all_comments;
}
async function getFollows() {
  const response = await axios.get(API_HOST + "/api/follows");

  return response.data;
}

async function toggleLike(post_id) {
  const username = getUser().username;
  const query = gql`
  mutation ($post_id: Int, $username: String) {
      toggle_like(input: {post_id: $post_id, username: $username}) {
        type
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query, {post_id, username});
  return data.toggle_like;
}
async function toggleDislike(post_id) {
  const username = getUser().username;
  const query = gql`
  mutation ($post_id: Int, $username: String) {
      toggle_dislike(input: {post_id: $post_id, username: $username}) {
        type
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query, {post_id, username});
  return data.toggle_dislike;
}
async function getStatus(post_id) {
  const username = getUser().username;
  const query = gql`
  query ($post_id: Int, $username: String) {
      like(post_id: $post_id, username: $username)
    }
  `;

  const data = await request(GRAPH_QL_URL, query, {post_id, username});
  return data.like;
}


async function isFollow(username) {
  const follower = getUser().username;
  const query = gql`
    query($follower: String, $author: String) {
      is_follow(follower: $follower, author: $author)
    }
  `

  const data = await request(GRAPH_QL_URL, query, {author: username, follower});

  return data.is_follow;
}

async function toggleFollow(username) {
  const follower = getUser().username;
  const query = gql`
    mutation($follower: String, $author: String) {
      toggle_follow(input: {follower: $follower, author: $author})
    }
  `
    
  const data = await request(GRAPH_QL_URL, query, {author: username, follower});

  return data.toggle_follow;
}

async function deleteUser(username) {
  const query = gql`
    mutation($username: String) {
      delete_user(username: $username)
    }
  `
  const data = await request(GRAPH_QL_URL, query, {username});

  return data.delete_user;
}

async function blockUser(username) {
  const query = gql`
    mutation($username: String) {
      block_user(username: $username)
    }
  `
  const data = await request(GRAPH_QL_URL, query, {username});

  return data.block_user;
}

async function getLevel() {
  const username = getUser().username;
  const query = gql`
    query($username: String) {
      level(username: $username)
    }
  `
  const data = await request(GRAPH_QL_URL, query, {username});

  return data.level;
}

export {
  getUsers,
  getPosts,
  getFollows,
  toggleLike,
  toggleDislike,
  getComments,

  isFollow,
  toggleFollow,

  deletePost,
  deleteUser,
  blockUser,
  getLevel,
  getStatus,
  getTimes,
  getCounts
}
