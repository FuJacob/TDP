import React, { useState, useEffect } from "react";

interface Bid {
  id: string | number;
  title: string;
  tenderName: string;
  submissionDate: string;
  status: "Pending" | "Under Review" | "Accepted" | "Rejected" | "Awarded";
  lastUpdated: string;
}

const MyBids: React.FC = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");

        if (!token) {
          setError("You must be logged in to view your bids.");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:3000/api/v1/bids", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: Failed to fetch bids`);
        }

        // The backend returns: { bids: [...], pagination: {...} }
        const data = await response.json();
        console.log("Raw response data:", data); // <--- Log #1

        // If data.bids is empty, you'll see an empty array in the console
        const rawBids = data.bids || [];

        // Convert raw DB columns to your front-end fields
        const mappedBids = rawBids.map((row: any) => ({
          id: row.bid_id,
          title: row.bid_title,
          tenderName: row.tender_ref,
          submissionDate: row.submission_date,
          status: row.bid_status,
          lastUpdated: row.last_updated_date,
        }));

        console.log("Mapped bids:", mappedBids); // <--- Log #2
        setBids(mappedBids);
      } catch (err) {
        setError("Error fetching bids. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  // Filtering State
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Sorting State
  const [sortKey, setSortKey] = useState<string>("submissionDate"); // Default sorting
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filtered Data
  const filteredBids = bids.filter((bid) => {
    const isStatusMatch = statusFilter ? bid.status === statusFilter : true;
    const isDateMatch =
      (!startDate || new Date(bid.submissionDate) >= new Date(startDate)) &&
      (!endDate || new Date(bid.submissionDate) <= new Date(endDate));

    return isStatusMatch && isDateMatch;
  });

  // Sorting Function
  const sortedBids = [...filteredBids].sort((a, b) => {
    let comparison = 0;

    if (sortKey === "submissionDate" || sortKey === "lastUpdated") {
      comparison =
        new Date(a[sortKey]).getTime() - new Date(b[sortKey]).getTime();
    } else if (sortKey === "status") {
      comparison = a.status.localeCompare(b.status);
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Bids</h1>

      {/* Filters & Sorting Section */}
      <div className="mb-4 flex flex-wrap items-end gap-6">
        {/* Status Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Bid Status</label>
          <select
            className="border p-2 rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Awarded">Awarded</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              className="border p-2 rounded-md"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <span className="text-gray-600 font-medium mt-5">to</span>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              className="border p-2 rounded-md"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Sorting Section */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Sort By</label>
          <select
            className="border p-2 rounded-md"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="submissionDate">Submission Date</option>
            <option value="lastUpdated">Last Updated</option>
            <option value="status">Bid Status</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Order</label>
          <select
            className="border p-2 rounded-md"
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as "asc" | "desc")
            }
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Show Loading Indicator */}
      {loading && <p className="text-gray-500">Loading bids...</p>}

      {/* Show Error Message If API Call Fails */}
      {error && <p className="text-red-500">{error}</p>}

      {/* No Bids Message */}
      {!loading && bids.length === 0 ? (
        <p className="text-gray-600 text-lg font-medium mt-4">
          You haven't submitted any bids yet.{" "}
          <span className="text-blue-500 cursor-pointer hover:underline">
            Start bidding now!
          </span>
        </p>
      ) : filteredBids.length === 0 ? (
        <p className="text-gray-600 text-lg font-medium mt-4">
          No matching bids found.
        </p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Bid Title</th>
              <th className="border p-2">Tender Name</th>
              <th className="border p-2">Submission Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Last Updated</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedBids.map((bid) => (
              <tr key={bid.id} className="text-center">
                <td className="border p-2">{bid.title}</td>
                <td className="border p-2">{bid.tenderName}</td>
                <td className="border p-2">{bid.submissionDate}</td>
                <td className="border p-2">
                  <span
                    className={`px-2 py-1 rounded-md text-white text-sm font-medium ${getStatusColor(
                      bid.status
                    )}`}
                  >
                    {bid.status}
                  </span>
                </td>
                <td className="border p-2">{bid.lastUpdated}</td>
                <td className="border p-2">
                  {["Pending", "Under Review"].includes(bid.status) && (
                    <>
                      <button className="text-blue-600 hover:underline mr-5">
                        Modify
                      </button>
                      <button className="text-red-600 hover:underline">
                        Withdraw
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

function getStatusColor(status: string) {
  switch (status) {
    case "Pending":
      return "bg-yellow-500";
    case "Under Review":
      return "bg-blue-500";
    case "Accepted":
      return "bg-green-500";
    case "Rejected":
      return "bg-red-500";
    case "Awarded":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
}

export default MyBids;

