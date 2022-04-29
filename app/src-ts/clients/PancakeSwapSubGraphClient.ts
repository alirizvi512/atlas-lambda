import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  DocumentNode,
} from 'apollo-boost';
import fetch from 'cross-fetch';

import { setContext } from '@apollo/client/link/context';

export class PanCakeSwapSubGraphClient {
  private readonly cache = new InMemoryCache();
  private readonly apolloClient;

  constructor() {
    const httpLink = new HttpLink({
      fetch,
      uri: 'https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2',
    });
    const getHeaders = () => {
      const headers = {};
      return headers;
    };

    const authLink = setContext((_: any, { }) => {
      const authHeaders = getHeaders();
      // return the headers to the context so httpLink can read them
      return {
        headers: authHeaders,
      };
    });
    this.apolloClient = new ApolloClient({
      link: authLink.concat(httpLink as any) as any,
      cache: this.cache,
      defaultOptions: {
        query: {
          fetchPolicy: 'no-cache',
        },
      }
    });
  }

  public static getSubGraphClient() {
    return new PanCakeSwapSubGraphClient();
  } // end of static function

  public query(query: DocumentNode, variables: any) {
    return this.apolloClient.query({
      query,
      variables,
    });
  }
}
