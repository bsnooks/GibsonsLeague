import React from 'react';
import { createBrowserHistory } from 'history';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
  gql
} from '@apollo/client';
import { cache } from './cache';
import { Router } from 'react-router';
export const typeDefs = gql`
  type GibsonsLeagueQuery {
    franchise(id: Guid, name: String): Franchise
    franchises: [Franchise]
    league(id: Guid, name: String = "Gibsons League"): League
    leagues: [League]
    player(id: Int, name: String): Player
  }
`;

// Set up our apollo-client to point at the server we created
// this can be local or a remote endpoint
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  uri: 'https://localhost:49163/graphql',
  headers: {
    'client-name': 'GibsonsLeagueHistoryApp',
    'client-version': '1.0.0',
  },
  typeDefs,
  resolvers: {},
});

const history = createBrowserHistory({
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router history={history}>
        <App />
      </Router>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
