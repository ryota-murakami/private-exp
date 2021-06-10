import React from 'react'
import { RouteComponentProps } from '@reach/router'
import Layout from '../components/PageContainer'

const NotFound: React.FC<RouteComponentProps> = (props) => (
  <Layout className="flex justify-center items-center">
    <h1 className="text-6xl">Page Not Found</h1>
  </Layout>
)

export default NotFound
