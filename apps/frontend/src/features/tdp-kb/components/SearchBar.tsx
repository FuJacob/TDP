import { useState, useEffect } from 'react'

interface SearchBarProps {
  onSearch: (filters: {
    query: string
    category: string
    location: string
    status: string
    deadlineFrom: string
    deadlineTo: string
    budgetMin: string
    budgetMax: string
    sortBy: string
  }) => void
  filters: {
    query: string
    category: string
    location: string
    status: string
    deadlineFrom: string
    deadlineTo: string
    budgetMin: string
    budgetMax: string
    sortBy: string
  }
}


const SearchBar = ({ onSearch, filters }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState(filters.query) // initialize with current search term from filters
  const [isLoading, setIsLoading] = useState(false) // track loading state for search

  // handle input changes for search term and filters
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // debounced search after user stops typing (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim() !== filters.query) {
        setIsLoading(true)
        // trigger search with the updated filters
        onSearch({ ...filters, query: searchTerm.trim() })
      }
    }, 500)

    // clear timeout if input changes before delay
    return () => clearTimeout(timer)
  }, [searchTerm, filters, onSearch])

  // handle form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setIsLoading(true)
      onSearch({ ...filters, query: searchTerm.trim() }) // apply the search term
    }
  }

  // clear the search term and reset the filters
  const handleClear = () => {
    setSearchTerm('') // reset search term
    onSearch({ ...filters, query: '' }) // reset search results
  }

  return (
    <form onSubmit={handleSearch} className="search-bar">
      {/* input field for the search term */}
      <input
        type="text"
        value={searchTerm}
        placeholder="Search for tenders..."
        onChange={handleInputChange} // update the search term when user types
        className="search-input"
      />

      {/* clear button only if there's text in the search bar */}
      {searchTerm && (
        <button type="button" onClick={handleClear} className="clear-button">
          Clear
        </button>
      )}

      {/* search button */}
      <button type="submit" className="search-button" disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search'} {/* show loading text when searching */}
      </button>
    </form>
  )
}

export default SearchBar
