import React, { memo } from 'react'

import Installation from '../../components/Installation/Installation'
import Loading from '../../components/Loading/Loading'
import ButtonGroup from '../../components/Pagination/ButtonGroup'
import usePagination from '../../components/Pagination/usePagination'
import RTKQueryErrorMessages from '../../components/RTKQueryErrorMessages/RTKQueryErrorMessages'

import PostRow from './PostRow'

const PostList: React.FC = memo(() => {
  const { page, totalPage, data, isLoading, error } = usePagination()

  if (error) {
    return <RTKQueryErrorMessages error={error} />
  }

  if (isLoading || data === undefined) {
    return <Loading />
  }

  if (data.postList.length === 0) {
    return <Installation />
  }

  return (
    <div className="flex h-full flex-col justify-between">
      <ul className="post-row-container">
        {data.postList?.map((post: Post, i: number) => {
          return <PostRow key={i} post={post} index={i} />
        })}
      </ul>
      <ButtonGroup page={page} totalPage={totalPage} />
    </div>
  )
})
PostList.displayName = 'PostList'

export default PostList
