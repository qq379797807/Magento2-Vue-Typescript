import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

// HTTP connection to the API
const httpLink: ApolloLink = createHttpLink({
    uri: 'http://dev.car.cn:80/graphql'
})

// Cache implementation
const cache: InMemoryCache = new InMemoryCache()

// Create the apollo client
const apolloClient: any = new ApolloClient({
    link: httpLink,
    cache
})

export default apolloClient