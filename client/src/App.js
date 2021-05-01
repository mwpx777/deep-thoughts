import React from 'react';

import Header from './components/Header';
import Footer from './components/Footer';
// apolloProvider provides data to all other components
import {ApolloProvider} from '@apollo/react-hooks';
// apolloClient gets the info ready when ready to use it
import ApolloClient from 'apollo-boost';


import Home from './pages/Home';

// establish connection to GraphQL server using Apollo
const client = new ApolloClient({
  uri: '/graphql'
});

function App() {
  return (
    // passing client prop to provider to have access to server's API data
    <ApolloProvider client={client}>
    <div className='flex-column justify-flex-start min-100-vh'>
      <Header />
      <div className='container'>
        <Home />
      </div>
      <Footer />
    </div>
    </ApolloProvider>
  );
}

export default App;
