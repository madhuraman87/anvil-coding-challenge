/* eslint-disable space-before-function-paren */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from 'theme'
import Input from 'components/Input'

export const InputElement = styled(Input)`
    width: 100%;    
    background: white;
    box-shadow: ${theme.shadows[50]};
    padding: ${theme.paddings[15]}px;
    margin-bottom: ${theme.paddings[20]}px;
    &::placeholder {
        opacity: 0.5;
    }
`

class SearchFiles extends Component {
    state = {
        searchQuery: '',
    }

    componentDidMount() {
        const { location } = this.props
        const queryParams = new URLSearchParams(location.search)
        const initialQuery = queryParams.get('q') || ''

        this.setState({ searchQuery: initialQuery })
    }

    handleSearchInputChange = (data) => {
        const { onSearchQueryChange } = this.props
        const newQuery = data
        this.setState({ searchQuery: newQuery })
        onSearchQueryChange(newQuery)
    }

    render() {
        const { searchQuery } = this.state

        return (
            < InputElement
                type="search"
                value={searchQuery}
                onChange={this.handleSearchInputChange}
                placeholder="Search by keyword"
                autoFocus
            />
        )
    }
}

SearchFiles.propTypes = {
    searchQuery: PropTypes.string.isRequired,
    onSearchQueryChange: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
}

export default SearchFiles
