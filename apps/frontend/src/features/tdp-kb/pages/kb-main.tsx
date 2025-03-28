import { useState } from 'react'
import SearchBar from "../../../features/tdp-kb/components/SearchBar"; // Make sure the import path is correct

const BmMain = () => {
  const [filters, setFilters] = useState({
    query: '',
    category: '',
    location: '',
    status: '',
    deadlineFrom: '',
    deadlineTo: '',
    budgetMin: '',
    budgetMax: '',
    sortBy: ''
  })

  const handleSearch = (updatedFilters: typeof filters) => {
    setFilters(updatedFilters)
    console.log('search triggered with:', updatedFilters)
  }

  return (
    <>
      <h1>knowledge base module</h1>
      <SearchBar
        filters={filters}
        onSearch={handleSearch}
      />
    </>
  )
}

export default BmMain
