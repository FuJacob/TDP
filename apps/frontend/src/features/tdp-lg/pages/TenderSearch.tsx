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
  // State for search filters
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState('')
  const [deadlineFrom, setDeadlineFrom] = useState('')
  const [deadlineTo, setDeadlineTo] = useState('')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [sortBy, setSortBy] = useState('relevance')
  const [selectedTender, setSelectedTender] = useState(false)

  // State for results
  const [tenders, setTenders] = useState<Tender[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

  // Debounced search on filter changes
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

  // Fetch on pagination changes
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

  // Pagination handler
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
    </PageLayout>
  )
}
