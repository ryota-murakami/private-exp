import type { RouteComponentProps } from '@reach/router'
import { Link } from '@reach/router'
import React, { memo, Suspense, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import breaks from 'remark-breaks'
import gfm from 'remark-gfm'

import Layout from '../../components/Layout'
import Button from '../../elements/Button'
import Loading from '../../elements/Loading'
import { assertIsDefined } from '../../lib/assertIsDefined'
import { selectLogin } from '../../redux/adminSlice'
import { useFetchPostQuery } from '../../redux/API'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { enqueSnackbar } from '../../redux/snackbarSlice'

import Head from './Head'
import { getCustomComponents } from './ReactMarkdownCostomComponents'

interface RouterParam {
  postId: Post['id']
}

const PostPage: React.FC<RouteComponentProps<RouterParam>> = memo(
  ({ postId }) => {
    assertIsDefined(postId)
    const dispatch = useAppDispatch()
    const login = useAppSelector(selectLogin)

    const { data, isLoading, error = null } = useFetchPostQuery(postId)

    useEffect(() => {
      if (error)
        dispatch(enqueSnackbar({ message: error.toString(), color: 'red' }))
    }, [dispatch, error])

    if (isLoading || data === undefined) {
      return (
        <Layout>
          <Loading />
        </Layout>
      )
    }

    return (
      <Layout data-cy="post-page-content-root">
        <Suspense fallback={<Loading />}>
          {/* Suspence for lazyload expesive <code /> component */}
          <>
            <Head post={data} />
            <h1 className="text-2xl pt-4 pb-6 font-semibold">{data.title}</h1>
            <ReactMarkdown // @ts-ignore too complex
              components={getCustomComponents(data)}
              /* @ts-ignore lib index.d.ts missmatch between "@types/node@16.4.12" and "rehype-raw@6.0.0" */
              rehypePlugins={[rehypeRaw]}
              /* @ts-ignore lib index.d.ts missmatch @types/mdast/index.d.ts */
              remarkPlugins={[breaks, gfm]}
              className="prose prose-lg"
            >
              {data.body}
            </ReactMarkdown>
          </>
          {login && (
            <div className="pt-8 flex justify-end">
              <Link to={`/dashboard/edit/${postId}`}>
                <Button variant="primary" data-cy="edit-btn">
                  Edit
                </Button>
              </Link>
            </div>
          )}
        </Suspense>
      </Layout>
    )
  }
)

export default PostPage
