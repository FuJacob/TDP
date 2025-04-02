import { useState } from 'react'
import SearchBar from '../../../features/tdp-kb/components/SearchBar'

const KbMain = () => {
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
    <div style={{ padding: '20px' }}>
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Welcome to the Knowledge Base
      </h1>
      <SearchBar filters={filters} onSearch={handleSearch} />
    </div>
  )
}

export default KbMain
