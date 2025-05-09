import { useState, useEffect } from 'react'
import { fetchTendersAPI } from '../../../api/api'
import 'react-toastify/dist/ReactToastify.css'
import { PageLayout } from '../../../components/pagelayout/FeaturePageLayout'
import SearchBar from '../../../features/tdp-kb/components/SearchBar' // Make sure the import path is correct
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'

// Define interfaces
interface Tender {
  title: string
  referenceNumber: string
  publicationDate: string
  description: string
  status: string
  closingDate: string
  contractStartDate: string
  contractEndDate: string
  category: string
  regions: string
}

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export const SearchTender: React.FC = () => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState('')
  const [deadlineFrom, setDeadlineFrom] = useState('')
  const [deadlineTo, setDeadlineTo] = useState('')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [sortBy, setSortBy] = useState('relevance')
  const [showFilters, setShowFilters] = useState(true)
  const [visibleCount, setVisibleCount] = useState(6)

  const [tenders, setTenders] = useState<Tender[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null)
  const openTenderModal = (tender: Tender) => {
    closeTenderModal()
    setSelectedTender(tender)
  }
  const closeTenderModal = () => setSelectedTender(null)

  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })

  const fetchTenders = async (filters: any) => {
    setLoading(true)
    setError('')

    const params = {
      query: encodeURIComponent(filters.query),
      category: filters.category,
      location: encodeURIComponent(filters.location),
      status: filters.status,
      deadline_from: filters.deadlineFrom,
      deadline_to: filters.deadlineTo,
      budget_min: filters.budgetMin,
      budget_max: filters.budgetMax,
      sort_by: filters.sortBy,
      page: pagination.page,
      limit: pagination.limit,
    }

    const response = await fetchTendersAPI(params)
    console.log('>>> Fetch params:', params)

    if (response.success) {
      setTenders(response.data.tenders || [])
      setPagination(response.data.pagination)
    } else {
      setError('Please log in and try again')
    }

    setLoading(false)
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPagination((prev) => ({ ...prev, page: 1 }))
      fetchTenders({
        query,
        category,
        location,
        status,
        deadlineFrom,
        deadlineTo,
        budgetMin,
        budgetMax,
        sortBy,
      })
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [
    query,
    category,
    location,
    status,
    deadlineFrom,
    deadlineTo,
    budgetMin,
    budgetMax,
    sortBy,
  ])

  useEffect(() => {
    fetchTenders({
      query,
      category,
      location,
      status,
      deadlineFrom,
      deadlineTo,
      budgetMin,
      budgetMax,
      sortBy,
    })
  }, [pagination.page, pagination.limit])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }))
    }
  }

  // Pass the search filters to SearchBar and handle search
  const handleSearch = (filters: any) => {
    setQuery(filters.query)
    setCategory(filters.category)
    setLocation(filters.location)
    setStatus(filters.status)
    setDeadlineFrom(filters.deadlineFrom)
    setDeadlineTo(filters.deadlineTo)
    setBudgetMin(filters.budgetMin)
    setBudgetMax(filters.budgetMax)
    setSortBy(filters.sortBy)
    fetchTenders(filters)
  }

  return (
    <PageLayout>
      <h1 className="text-3xl font-bold mb-4">Search for Tenders</h1>

      {/* SearchBar Component */}
      <SearchBar
        onSearch={handleSearch}
        filters={{
          query,
          category,
          location,
          status,
          deadlineFrom,
          deadlineTo,
          budgetMin,
          budgetMax,
          sortBy,
        }}
      />

      {/* Results */}
      <div className="mt-6">
        {loading && <p className="text-gray-500">Loading tenders...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && tenders.length === 0 && (
          <p className="text-gray-500">No results found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenders.map((tender) => (
            <div
              key={tender.referenceNumber}
              className="border p-4 rounded shadow-sm hover:shadow-md transition-shadow w-full h-[300px] overflow-hidden cursor-pointer relative"
            >
              <h2 className="text-xl font-bold text-black truncate">
                {tender.title}
              </h2>
              <p className="text-sm text-gray-600 mb-1 truncate">
                <span className="font-semibold">Reference:</span>{' '}
                {tender.referenceNumber}
              </p>
              {/* More tender details */}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <Stack>
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={(event, page) => handlePageChange(page)}
            />
          </Stack>
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Stack filters and results vertically for all screen sizes */}
          <div className="flex flex-col gap-6 mb-6">
            {/* Filters section */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <select
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="*GD">General</option>
                  <option value="*SRV">Service</option>
                  <option value="*CNST">Construction</option>
                </select>
                <input
                  type="text"
                  placeholder="Location"
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <select
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="Awarded">Awarded</option>
                </select>
                <div className="flex flex-col space-y-1">
                  <label className="text-gray-700 text-sm font-semibold">
                    Deadline Start Date:
                  </label>
                  <input
                    type="date"
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={deadlineFrom}
                    onChange={(e) => setDeadlineFrom(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-gray-700 text-sm font-semibold">
                    Deadline End Date:
                  </label>
                  <input
                    type="date"
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={deadlineTo}
                    onChange={(e) => setDeadlineTo(e.target.value)}
                  />
                </div>
                <input
                  type="number"
                  placeholder="Min Budget"
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max Budget"
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                />
                <select
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest_budget">Highest Budget</option>
                  <option value="lowest_budget">Lowest Budget</option>
                </select>
                <div className="w-full mb-4">
                  <button
                    onClick={fetchTenders}
                    className="px-4 py-2 rounded transition"
                    style={{ backgroundColor: '#373292', color: '#ffffff' }}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}

            {/* Search input */}
            <input
              type="text"
              placeholder="Search for tenders..."
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {/* Results */}
            <div className="mt-6">
              {loading && <p className="text-gray-500">Loading tenders...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {!loading && tenders.length === 0 && (
                <p className="text-gray-500">No results found.</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tenders.slice(0, visibleCount).map((tender) => (
                  <div
                    key={tender.referenceNumber}
                    className="border p-4 rounded shadow-sm hover:shadow-md transition-shadow w-full h-[300px] overflow-hidden cursor-pointer relative"
                    onClick={() => openTenderModal(tender)}
                  >
                    <h2 className="text-xl font-bold text-black truncate">
                      {tender.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-1 truncate">
                      <span className="font-semibold">Reference:</span>{' '}
                      {tender.referenceNumber}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-semibold">Status:</span>
                      <span
                        className={`ml-1 px-2 py-1 rounded ${
                          tender.status === 'Open'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {tender.status}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 mb-1 truncate">
                      <span className="font-semibold">Category:</span>{' '}
                      {tender.category}
                    </p>
                    <p className="text-sm text-gray-600 mb-1 truncate">
                      <span className="font-semibold">Regions:</span>{' '}
                      {tender.regions}
                    </p>
                    <p className="text-gray-700 mt-2 text-sm line-clamp-3">
                      <span className="font-semibold">Description:</span>{' '}
                      {tender.description}
                    </p>
                    <div
                      className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white to-transparent p-2 text-center font-bold"
                      style={{ color: '#373292' }}
                    >
                      Click to see more...
                    </div>
                  </div>
                ))}
              </div>

              {/* View More Button */}
              {visibleCount < tenders.length && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    View More
                  </button>
                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {pagination.page} of {pagination.totalPages || 1}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 bg-black text-white rounded disabled:bg-gray-300"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {selectedTender && (
            <div>
              {/* <div
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                style={{ zIndex: 1000 }}
                onClick={closeTenderModal}
              >
                <div
                  className="bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-xl font-bold">{selectedTender.title}</h2>
                  <p>
                    <strong>Reference:</strong> {selectedTender.referenceNumber}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedTender.status}
                  </p>
                  <p>
                    <strong>Closing Date:</strong> {selectedTender.closingDate}
                  </p>
                  <p>
                    <strong>Category:</strong> {selectedTender.category}
                  </p>
                  <p>
                    <strong>Regions:</strong> {selectedTender.regions}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedTender.description}
                  </p>
                  <button
                    onClick={closeTenderModal}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Close
                  </button>
                </div>
              </div> */}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
