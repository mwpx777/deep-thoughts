// import React from 'react';

// import ThoughtList from '../components/ThoughtList';
// import FriendsList from "../components/FriendsList";
// import Auth from '../utils/auth';

// // import useQuery hook from Apollo's react-hooks library
// import { useQuery } from '@apollo/react-hooks';

// // destructure object to extract 'data' from useQuery hooks respones and rename it 'userData' 
// // if logged in , userData will hold all of returned info from the query
// import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';
// import ThoughtForm from '../components/ThoughtForm';


// const Home = () => {
//   const { data: userData } = useQuery(QUERY_ME_BASIC);

//   // this will call the loggedIn method in Auth
//   const loggedIn = Auth.loggedIn();
//   // use useQuery hook to make query request
//   // `loading` property indicates the request isn't done yet
//   // `loading` can conditionally render data if it exists or not
//   // when data returned, it is stored in the `data` property
//   const { loading, data } = useQuery(QUERY_THOUGHTS);

//   // this is optional chaining - doesn't need to check if object exists before accessing its properties
//   // if data exists, store it in `thoughts` constant
//   // if data undefined, save empty array to thoughts component
//   const thoughts = data?.thoughts || []
//   console.log(thoughts);

//   return (
//     <main>
//       <div className='flex-row justify-space-between'>
//         {/* render ThoughtForm only if loggedIn */}
//         {loggedIn && (
//           <div className="col-12 mb-3">
//             <ThoughtForm />
//             </div>
//             )}
//         <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
//           {loading ? (
//             <div>Loading...</div>
//           ) : (
//             <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." />
//           )}
//         </div>
//         {loggedIn && userData ? (
//           <div className = 'col-12 col-lg-3 mb-3'>
//           <FriendsList
//             username={userData.me.username}
//             friendCount={userData.me.friendCount}
//             friends={userData.me.friends}
//           />
//           </div>
//   ) : null}
//   </div>
//     </main>
//   );
// };

// export default Home;

import React from 'react';
import ThoughtList from '../components/ThoughtList';
import ThoughtForm from '../components/ThoughtForm';
import FriendList from '../components/FriendList';

import Auth from '../utils/auth';
import { useQuery } from '@apollo/react-hooks';
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';

const Home = () => {
  const { loading, data } = useQuery(QUERY_THOUGHTS);
  const { data: userData } = useQuery(QUERY_ME_BASIC);
  const thoughts = data?.thoughts || [];

  const loggedIn = Auth.loggedIn();

  return (
    <main>
      <div className="flex-row justify-space-between">
        {loggedIn && (
          <div className="col-12 mb-3">
            <ThoughtForm />
          </div>
        )}
   
        <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." />
          )}
        </div>
        {loggedIn && userData ? (
          <div className="col-12 col-lg-3 mb-3">
            <FriendList
              username={userData.me.username}
              friendCount={userData.me.friendCount}
              friends={userData.me.friends}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Home;

