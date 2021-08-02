import React, { useEffect, lazy, Suspense } from 'react'
import type { RouteComponentProps } from '@reach/router'
import { Link } from '@reach/router'
import breaks from 'remark-breaks'
import gfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import ReactMarkdown from 'react-markdown'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import Layout from '../components/Layout'
import Button from '../elements/Button'
import { useFetchPostQuery } from '../redux/api'
import { selectLogin } from '../redux/adminSlice'
import { enque } from '../redux/snackbarSlice'
import type { Post as PostType } from '../../types'
import Loading from '../elements/Loading'

interface RouterParam {
  postId: PostType['id']
}

const a: React.FC = (props) => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <a {...props} target="_blank" className="text-blue-700"></a>
)

const code = lazy(
  () =>
    // @ts-ignore @TODO react-syntax-highlighter issue
    import(/* webpackChunkName: "code" */ '../elements/code')
)

const getCustomComponents = (data: { body: string | string[] }) => {
  return data.body.includes('```') ? { a, code } : { a }
}

const Post: React.FC<RouteComponentProps<RouterParam>> = ({ postId }) => {
  const dispatch = useAppDispatch()
  const login = useAppSelector(selectLogin)

  const {
    data,
    isLoading,
    error = null,
  } = useFetchPostQuery(postId as PostType['id'])

  useEffect(() => {
    if (error) dispatch(enque({ message: error.toString(), color: 'red' }))
  }, [dispatch, error])

  return (
    <Layout data-cy="postPage">
      <Suspense fallback={<Loading />}>
        {isLoading ? (
          <Loading />
        ) : (
          data && (
            <>
              <h1 className="text-2xl pt-4 pb-6 font-semibold">{data.title}</h1>
              <ReactMarkdown
                components={getCustomComponents(data)}
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[breaks, gfm]}
                className="prose prose-lg"
              >
                {data.body}
              </ReactMarkdown>
            </>
          )
        )}
        {login && (
          <div className="mt-16">
            <Link to={`/dashboard/edit/${postId}`}>
              <Button
                className="bg-green-500 active:bg-green-600 text-white"
                data-cy="edit-btn"
              >
                Edit
              </Button>
            </Link>
          </div>
        )}
      </Suspense>
    </Layout>
  )
}

export default React.memo(Post, () => true)
