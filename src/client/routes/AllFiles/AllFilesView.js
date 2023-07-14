/* eslint-disable space-before-function-paren */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Content from 'components/Content'
import FileList from 'components/FileList'
import Button from 'components/Button'
import Toggler from 'components/Toggler'
import IconPlus from 'components/icons/IconPlus'

import NewFileForm from './NewFileForm'
import SearchFiles from './SearchFiles'


const StyledContainer = styled.div``

export const Title = styled.h1`
  margin-bottom: 20px;
`

class AllFilesView extends Component {
  state = {
    searchQuery: '',
    filteredFileList: [],
  }

  componentDidMount() {
    const { location } = this.props
    const queryParams = new URLSearchParams(location.search)
    const initialQuery = queryParams.get('q') || ''

    this.setState({ searchQuery: initialQuery })
    this.updateFilteredFileList()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.searchQuery !== nextState.searchQuery ||
      this.state.filteredFileList !== nextState.filteredFileList
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery) {
      this.updateFilteredFileList()
    }
  }

  componentWillUnmount() {
    clearTimeout(this.debouncedFiltering)
  }

  updateFilteredFileList = () => {
    const { searchQuery } = this.state
    const { files } = this.props
    const filteredFiles = searchQuery ? files.filter((file) =>
      file.filename.toLowerCase().startsWith(searchQuery.toLowerCase())
    ) : files
    this.setState({ filteredFileList: filteredFiles })
  }

  handleSearchQueryChange = (newQuery) => {
    const { navigate } = this.props
    this.setState({ searchQuery: newQuery })

    clearTimeout(this.debouncedFiltering)
    this.debouncedFiltering = setTimeout(this.updateFilteredFileList, 300)

    const queryParams = new URLSearchParams(window.location.search)
    queryParams.set('q', newQuery)
    navigate({ search: queryParams.toString() })

  }

  handleAddFile = (data) => {
    const { addFile } = this.props
    return addFile(data)
  }

  renderSearchComponent() {
    const { location } = this.props
    const { searchQuery } = this.state
    return (
      <SearchFiles location={location} searchQuery={searchQuery}
        onSearchQueryChange={this.handleSearchQueryChange} />
    )
  }

  renderFiles() {
    const { filteredFileList } = this.state
    return (
      <Content.Card>
        {filteredFileList.length ? (<FileList
          files={filteredFileList}
        />) : (<StyledContainer>No Files found</StyledContainer>)}
      </Content.Card>
    )
  }

  renderNewFileForm() {
    return (
      <Toggler
        renderButton={({ showItem, onClick }) => (
          <Button type="link" onClick={onClick}>
            <IconPlus />
            <span>{showItem ? 'Close Add Form' : 'Add a File'}</span>
          </Button>
        )}
      >
        {() => (
          <NewFileForm onSubmit={this.handleAddFile} />
        )}
      </Toggler>
    )
  }

  render() {
    const { username } = this.props
    return (
      <StyledContainer>
        <Title>{`Hi ${username} 👋`}</Title>
        {this.renderSearchComponent()}
        {this.renderFiles()}
        {this.renderNewFileForm()}
      </StyledContainer>
    )
  }
}

AllFilesView.propTypes = {
  addFile: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  files: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    filename: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  })).isRequired,
  location: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired,
}

export default AllFilesView
