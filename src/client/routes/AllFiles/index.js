/* eslint-disable space-before-function-paren */
import _ from 'lodash'
import React from 'react'
import AllFilesView from './AllFilesView'
import useFetch from 'hooks/useFetch'
import FetchFeedback from 'components/FetchFeedback'
import { useLocation, useNavigate } from 'react-router-dom'

function createUpdateRequest({ url, method, onSuccess }) {
  return async (data) => {
    const result = await fetch(url, {
      method: method || 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (onSuccess) onSuccess(result)
  }
}

const AllFiles = () => {
  const username = useFetch('/api/username')
  const files = useFetch('/api/files')
  const location = useLocation()
  const navigate = useNavigate()

  const addFile = createUpdateRequest({
    url: '/api/files',
    onSuccess: () => files.refetch(),
  })


  return (
    <FetchFeedback
      responses={[username, files]}
    >
      {() => (
        <AllFilesView
          addFile={addFile}
          files={files.data}
          username={_.get(username, 'data.username')}
          location={location}
          navigate={navigate}
        />
      )}
    </FetchFeedback>
  )
}

export default AllFiles
