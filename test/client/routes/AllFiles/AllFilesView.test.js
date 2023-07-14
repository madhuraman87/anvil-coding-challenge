import React from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'
import sinon from 'sinon'

import AllFilesView, { Title } from 'client/routes/AllFiles/AllFilesView'

describe('AllFilesView', function () {
  let component
  let clock
  const addFilesMock = sinon.spy()
  const mockFile = [
    { id: 1, filename: 'file1.txt', src: 'file1.txt', description: 'File 1' },
    { id: 2, filename: 'file2.txt', src: 'file2.txt', description: 'File 2' },
  ]
  // Mock props
  const navigateMock = sinon.spy()
  const locationMock = { search: '' }

  beforeEach(() => {
    // Render the component
    component = mount(
      <AllFilesView
        addFile={addFilesMock}
        username="Sally"
        files={mockFile}
        location={locationMock}
        navigate={navigateMock}
      />
    )
    clock = sinon.useFakeTimers()
  })

  afterEach(() => {
    clock.restore()
    component.unmount()
  })

  it('renders the title', function () {
    const title = component.find(Title)
    expect(title).to.have.length(1)
    expect(title.text()).to.equal('Hi Sally 👋')
  })

  it('should render the SearchFiles component', () => {
    const searchComponent = component.find('SearchFiles')
    expect(searchComponent.exists()).to.be.true
  })

  it('should update state and call updateFilteredFileList when handleSearchQueryChange is called', () => {
    const instance = component.instance()

    // Spy on the necessary methods
    const setQuerySpy = sinon.spy(instance, 'setState')
    const updateFilteredFileListSpy = sinon.spy(instance, 'updateFilteredFileList')

    // Simulate a change event on the search component
    const newQuery = 'example'
    instance.handleSearchQueryChange(newQuery)

    expect(setQuerySpy.calledWith({ searchQuery: newQuery })).to.be.true
    expect(navigateMock.calledOnce).to.be.true
    expect(navigateMock.args[0][0]).to.deep.equal({ search: 'q=example' })
    expect(updateFilteredFileListSpy.called).to.be.false

    // Fast-forward the clock to trigger the debounce delay
    clock.tick(300)

    // Expectations after the debounce delay
    expect(updateFilteredFileListSpy.calledOnce).to.be.true

    // Restore the original methods
    setQuerySpy.restore()
    updateFilteredFileListSpy.restore()
  })
  it('should call addFile with data when handleAddFile is called', () => {
    const data = { file: { name: 'newFile.txt' } }
    component.instance().handleAddFile(data)
    expect(addFilesMock.calledWith(data)).to.be.true
  })

  it('should call addFile with data when handleAddFile is called with duplicate filename', () => {
    const data = { file: { name: 'file1.txt' } }
    component.instance().handleAddFile(data)
    const expectedData = { ...data, file: { name: 'file1(1).txt' } }
    expect(addFilesMock.calledWith(expectedData)).to.be.true
  })

  it('should add a file with a unique filename when a duplicate filename is provided', () => {
    const duplicateFilename = 'file1.txt'
    const data = { file: { name: duplicateFilename } }

    const addFileStub = sinon.stub().returnsArg(0)
    component.setProps({ addFile: addFileStub })

    component.instance().handleAddFile(data)

    // Check if addFileStub was called with a unique filename
    expect(addFileStub.calledOnce).to.be.true
    const calledWithFileData = addFileStub.args[0][0]
    expect(calledWithFileData.file.name).to.not.equal(duplicateFilename)
    expect(calledWithFileData.file.name).to.match(/file1\(.*\).txt/)
  })

})
