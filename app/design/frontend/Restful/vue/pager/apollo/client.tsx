import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

declare let window: any

// HTTP connection to the API
const httpLink: ApolloLink = createHttpLink({
    uri: `${window.location.origin}/graphql`
})

// HTTP headers middleware
const middlewareLink: ApolloLink = new ApolloLink((operation: any, forward: any) => {
    const token = window.sessionStorage.getItem('access_token')

    operation.setContext({
        headers: {
            Authorization: `Bearer ${token}` || null
        }
    })

    return forward(operation)
})

// Cache implementation
const cache: InMemoryCache = new InMemoryCache()

// Create the apollo client
const apolloClient: any = new ApolloClient({
    link: middlewareLink.concat(httpLink),
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