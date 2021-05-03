// PROFILE

import React from 'react';

// useParams hook will return a key/value pair - takes username from url
import { Redirect, useParams } from 'react-router-dom';
import ThoughtList from '../components/ThoughtList';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { QUERY_USER, QUERY_ME } from '../utils/queries';

import FriendsList from '../components/FriendsList';

import Auth from '../utils/auth';

import {ADD_FRIEND} from '../utils/mutations';
import ThoughtForm from '../components/ThoughtForm';


const Profile = () => {
  const { username: userParam } = useParams();

  const [addFriend] = useMutation(ADD_FRIEND);

  // if there are userParams, use QUER_USER, or else use QUERY_ME
  const { loading, data } = useQuery( userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam }
  });

  // this const will either have data.me, data.user, or return empty object
  const user =  data?.me || data?.user || {};

  // this will compare if /profile matches /profile/<username>
  // redirect to personal profile page if username is the loggedin user
  if(Auth.loggedIn() && Auth.getProfile().data.username === userParam){
    return <Redirect to="/profile" />;
  }


  if (loading) {
    return <div>Loading...</div>;
  }

  if(!user?.username){
    return(
      <h4> You need to be logged in to see this page.  Use navigation links above to sign up or log in!</h4>
    );
  }

  const handleClick = async () => {
    try {
      await addFriend({
        variables: { id: user._id }
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>

        {/* this button will only display when there is a name in /profile/<username> */}
        {userParam && (
          <button className="btn ml-auto" onClick={handleClick}>
            Add Friend
          </button>
        )}
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList thoughts={user.thoughts} title={`${user.username}'s thoughts...`} />
        </div>

        <div className="col-12 col-lg-3 mb-3">
          <FriendsList
            username={user.username}
            friendsCount={user.friendCount}
            friends={user.friends}
            />
        </div>
      </div>
      {/* ThoughtForm will only display if user is loggedin */}
      <div className="mb-3">{!userParam && <ThoughtForm />}</div>
    </div>
  );
};

export default Profile;
