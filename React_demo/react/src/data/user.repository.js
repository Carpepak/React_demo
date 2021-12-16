import axios from "axios";

const API_HOST = "http://localhost:4000";
const USER_KEY = "user";
//option methods of user
//1.credit user 
async function verifyUser(username, password) {
  const response = await axios.get(API_HOST + "/api/users/login", { params: { username, password } });
  const user = response.data;
  //return a session
  //const user = response.data.data;
  if(user !== null)
    setUser(user);
  return user;
}
/*when you got corresponding function,  you should send get/post requests
methods of users:
1.find
2.create new user
3.remove user
4.get posts with current user
****you must set user first and you can get user, to set user, you must verify whether user exists
*/

//just like func name
async function findUser(id) {
  const response = await axios.get(API_HOST + `/api/users/select/${id}`);
  return response.data;
}
//
async function createUser(user) {
  const response = await axios.post(API_HOST + "/api/users", user);
  return response.data;
}
//get posts
async function getPosts() {
  const response = await axios.get(API_HOST + "/api/posts");
  return response.data;
}
//get post
async function getPost(post_id) {
  const response = await axios.get(API_HOST + `/api/posts/select/${post_id}`);
  return response.data;
}

async function updatePost(post) {
  const response = await axios.post(API_HOST + "/api/posts/update", post);
  return response.data;
}

async function createPost(post) {
  const response = await axios.post(API_HOST + "/api/posts", post);
  return response.data;
}

function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}
//read data
function getUser() {
  return JSON.parse(localStorage.getItem(USER_KEY));
}
//remove data
function removeUser() {
  logout();
  localStorage.removeItem(USER_KEY);
}

// async function login(){
//   const user = getUser();
//   if(!user) return false;
//   const username = user.username;
//   await axios.get(API_HOST+`/api/users/in/${username}`);
//   return true;
// }
async function login() {
  const user = getUser();
  if(!user)
    return false;
  const username = user.username;
  await axios.get(API_HOST+`/api/users/in/${username}`);
  return true;
}

async function logout() {
  const user = getUser();
  if(!user)
    return false;
  const username = user.username;
  await axios.get(API_HOST+`/api/users/out/${username}`);

  return true;
}

export {
  verifyUser, findUser, createUser,
  getPosts, createPost,
  getUser, removeUser, setUser,
  getPost, updatePost,
  login, logout
}
