import React, { useState, useEffect } from "react";
import  { Card, Button }  from  'react-bootstrap' ;
import { Link } from "react-router-dom";
import { getUser } from "../data/user.repository";
import { getProfile, deleteProfile } from "../data/profile.repository"

function MyProfile(props) {
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const currentProfile = await getProfile(getUser().username);
      setProfile(currentProfile);
    }
    loadProfile();
  }, [])
  
  const deleteAlert =() =>{
    setDeleteMessage('Successfully deleted!');
  }

  const onDelete = async () => {
    await deleteProfile();
    props.logoutUser();
  }

  if(!profile)
    return null;
  return (
    <div style={{ textAlign:"center", marginLeft:"38%"}}>
      <Card style={{ width: '20rem'}}>
        <Card.Img variant="top" src="../logo192.png" />
        <Card.Body>
          <Card.Title>NickName: {profile.username}  </Card.Title>
          <Card.Title>FirstName: {profile.first_name?profile.first_name:""}</Card.Title>
          <Card.Title>LastName: {profile.last_name?profile.last_name:""}</Card.Title>
          <Card.Text>Email: {profile.email ? profile.email : ""}</Card.Text>
          <Link to="/editprofile">
            <Button variant="primary">Edit</Button>{' '}
          </Link>
          <Link onClick={onDelete} to="/">
            <Button variant="secondary" onClick={deleteAlert}>Delete</Button>
          </Link>
        </Card.Body>
        {deleteMessage !== null &&
            <div className="form-group">
              <br></br>
              <span className="text-success">{deleteMessage}</span>
            </div>
        }
      </Card>
    </div>
    
  );


}

export default MyProfile;
