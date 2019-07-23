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
    cache,
    connectToDevTools: true
})

// Create the apolo options
const apolloOptions: any = {
    defaultClient: apolloClient,
    defaultOptions: {
        $query: {
            loadingKey: 'loadding',
            fetchPolicy: 'cache-and-network'
        }
    },
    errorHandler: (error: any) => {
        console.error(error)
    }
}

export default apolloOptions