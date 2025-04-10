import { useState } from 'react'
import { filterOpenTenderNotices, getOpenTenderNoticesToDB } from '../../../api/api'
import { SubNavMenu } from '../components/SubNavMenu';
import { FilteredTenderData } from '../components/FilteredTenderData';
import { PageLayout } from '../../../components/pagelayout/FeaturePageLayout'

export const AiSearchTender: React.FC = () => {
  const [formData, setFormData] = useState({ prompt: '' });
  const [showData, setShowData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSearchUI, setShowSearchUI] = useState(true);
  const [expandResults, setExpandResults] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const refreshTenders = async () => {
    setLoading(true);
    setError(null);
    try {
      await getOpenTenderNoticesToDB();
    } catch (e) {
      console.error('Failed to refresh tenders:', e);
      setError('Failed to refresh tenders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowData(false);
    setLoading(true);
    setError(null);
    try {
      await filterOpenTenderNotices(formData.prompt);
      setShowData(true);
    } catch (e) {
      console.error('Failed to filter tenders:', e);
      setError('Failed to generate leads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <h1 className="text-3xl font-bold mb-4">AI-Powered Tender Search</h1>

      <button
        onClick={refreshTenders}
        disabled={loading}
        className="text-white bg-black h-12 text-xl font-bold mb-4 rounded disabled:bg-gray-400"
      >
        {loading ? 'Refreshing...' : 'Refresh Open Tender Notices'}
      </button>

      {/* Mobile toggle for filters */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowSearchUI(!showSearchUI)}
          className="text-white bg-blue-600 px-4 py-2 rounded"
        >
          {showSearchUI ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Search Form (collapsible on mobile) */}
      <div className={`${showSearchUI ? 'block' : 'hidden'} md:block`}>
        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="text"
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
            placeholder="Tell us what kind of tenders you want (e.g., 'construction in Texas')"
            className="border-2 border-gray-300 w-full h-12 px-4 text-xl rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="text-white bg-black w-full h-12 text-xl font-bold rounded disabled:bg-gray-400"
          >
            {loading ? 'Generating...' : 'Generate Leads'}
          </button>
        </form>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Collapsible AI Search Results */}
      {showData && (
        <div className="border-t border-gray-300 pt-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-semibold">Search Results</h2>
            <button
              onClick={() => setExpandResults(!expandResults)}
              className="text-blue-600 underline text-sm"
            >
              {expandResults ? 'Collapse Results' : 'Expand Results'}
            </button>
          </div>

          {expandResults && <FilteredTenderData />}
        </div>
      )}
    </PageLayout>
  );
};
