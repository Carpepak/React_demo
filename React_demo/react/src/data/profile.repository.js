import axios from "axios";
import { getUser } from "./user.repository";

// --- Constants ----------------------------------------------------------------------------------
const API_HOST = "http://localhost:4000";

// --- Profile ---------------------------------------------------------------------------------------
async function getProfiles() {
  const response = await axios.get(API_HOST + `/api/profiles`);

  return response.data;
}

async function getProfile(username) {
  const response = await axios.get(API_HOST + `/api/profiles/select/${username}`);

  return response.data;
}

async function deleteProfile() {
  const response = await axios.get(API_HOST + `/api/profiles/delete/${getUser().username}`);

  return response.data;
}

async function updateProfile(profile) {
  profile.username = getUser().username;
  const response = await axios.put(API_HOST + "/api/profiles", profile);

  return response.data;
}

export {
  getProfiles, getProfile, updateProfile, deleteProfile
}