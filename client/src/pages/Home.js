import React from 'react';
// import useQuery hook from Apollo's react-hooks library
import {useQuery} from '@apollo/react-hooks';
import{QUERY_THOUGHTS} from '../utils/queries';
import ThoughtList from '../components/ThoughtList';

const Home = () => {
  // use useQuery hook to make query request
  // `loading` property indicates the request isn't done yet
  // `loading` can conditionally render data if it exists or not
  // when data returned, it is stored in the `data` property
  const {loading, data} = useQuery(QUERY_THOUGHTS);

  // this is optional chaining - doesn't need to check if object exists before accessing its properties
  // if data exists, store it in `thoughts` constant
  // if data undefined, save empty array to thoughts component
  const thoughts = data?.thoughts || []
  console.log(thoughts);

  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className='col-12 mb-3'>
          {loading ? (
          <div>Loading...</div>
        ) : (
          <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..."/>
        )}
        </div>
      </div>
    </main>
  );
};

export default Home;
