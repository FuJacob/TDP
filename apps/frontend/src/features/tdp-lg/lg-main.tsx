// apps/frontend/src/features/tdp-lg/lg-main.tsx
import { useState } from 'react'
import { filterOpenTenderNotices, getOpenTenderNoticesToDB } from '../../api/api'
import { FilteredTenderData } from './components/FilteredTenderData'
import { useNavigate } from 'react-router-dom'

const LgMain = () => {
  const [formData, setFormData] = useState({ prompt: '' })
  const [showData, setShowData] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const refreshTenders = async () => {
    try {
      await getOpenTenderNoticesToDB()
    } catch (e) {
      console.log(e)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setShowData(false)
    e.preventDefault()
    try {
      await filterOpenTenderNotices(formData.prompt)
      setShowData(true)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <h1>Lead Generation Module</h1>
      <button
        onClick={refreshTenders}
        className="text-white bg-black h-12 text-2xl font-bold mb-4"
      >
        Click here to refresh open tender notices
      </button>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          name="prompt"
          value={formData.prompt}
          onChange={handleChange}
          placeholder="Tell what kind of tenders you want"
          className="border-2 text-2xl border-black w-full h-16 mb-4"
        />
        <button
          type="submit"
          className="text-white bg-black w-full h-16 text-3xl font-bold"
        >
          Generate Leads
        </button>
      </form>
      {showData && <FilteredTenderData />}
      {/* New button to navigate to Bid Status Updates page */}
      <div className="mt-8">
        <button
          onClick={() => navigate('/bidupdates')}
          className="px-6 py-3 bg-blue-600 text-white text-xl font-bold rounded"
        >
          View Bid Status Updates
        </button>
      </div>
    </>
  )
}

export default LgMain
