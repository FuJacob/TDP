import React, { useState, useEffect } from "react";
import BidDashboard from "../components/BidDashboard";
import io from 'socket.io-client';
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
  const [allBids, setAllBids] = useState<Bid[]>([]);
  const [filteredBids, setFilteredBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const bidCounts = {
    Pending: filteredBids.filter((b) => b.status === "Pending").length,
    "Under Review": filteredBids.filter((b) => b.status === "Under Review").length,
    Accepted: filteredBids.filter((b) => b.status === "Accepted").length,
    Rejected: filteredBids.filter((b) => b.status === "Rejected").length,
    Awarded: filteredBids.filter((b) => b.status === "Awarded").length,
  };
  

  // State for filter section visibility
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Function to clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
    setSortKey("submissionDate");
    setSortOrder("asc");
    setFilteredBids(allBids);
  };
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
      console.log("Raw response data:", data);

      const rawBids = data.bids || [];

      // Convert raw DB columns to front-end fields
      const mappedBids = rawBids.map((row: any) => ({
        id: row.bid_id,
        title: row.bid_title,
        tenderName: row.tender_ref,
        submissionDate: row.submission_date,
        status: row.bid_status,
        lastUpdated: row.last_updated_date,
      }));

      console.log("Mapped bids:", mappedBids); 
      setAllBids(mappedBids);
      setFilteredBids(mappedBids);
    } catch (err) {
      setError("Error fetching bids. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBids();
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
      query: { token },
    });

    socket.on("bidInserted", (data) => {
      fetchBids();
      console.log("New bid inserted", data);
    });
    socket.on("bidUpdated", (data) => {
      fetchBids();
      console.log("New bid updated", data);
    });
    socket.on("bidDeleted", (data) => {
      fetchBids();
      console.log("Bid deleted", data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Filtering State
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Sorting State
  const [sortKey, setSortKey] = useState<string>("submissionDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleFilter = () => {
    let filtered = [...allBids];
  
    if (statusFilter) {
      filtered = filtered.filter((bid) => bid.status === statusFilter);
    }
  
    if (startDate && endDate) {
      filtered = filtered.filter(
        (bid) =>
          new Date(bid.submissionDate) >= new Date(startDate) &&
          new Date(bid.submissionDate) <= new Date(endDate)
      );
    }
  
    if (searchQuery) {
      filtered = filtered.filter((bid) =>
        bid.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    console.log("Filtered bids:", filtered);
    const sortedFilteredBids = sortBids(filtered);
    setFilteredBids(sortedFilteredBids);
    setShowFilters(false);
  };

  

  // Sorting Function
  const sortBids = (bidsToSort: Bid[]) => {
    return [...bidsToSort].sort((a, b) => {
      let comparison = 0;
  
      if (sortKey === "submissionDate" || sortKey === "lastUpdated") {
        comparison = new Date(a[sortKey]).getTime() - new Date(b[sortKey]).getTime();
      } else if (sortKey === "status") {
        comparison = a.status.localeCompare(b.status);
      }
  
      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  return (
    <div className="p-4">
      {/* Dashboard as Responsive Grid with Centered Text */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {Object.entries(bidCounts).map(([status, count]) => (
          <div
            key={status}
            className={`p-4 rounded-lg shadow-md text-white flex flex-col justify-center items-center ${getStatusColor(status)}`}
          >
            <p className="text-xl font-semibold text-center">{status}</p>
            <p className="text-3xl font-bold break-words text-center">{count}</p>
          </div>
        ))}
      </div>
  
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search bids by title and hit apply (in Filters)."
          className="border p-2 rounded-md w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
  
      {/* Filters Toggle Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-gray-200 px-4 py-2 rounded-md flex items-center text-gray-800 w-full sm:w-auto justify-center"
        >
          ⚙️ Filters
        </button>
        <button
          onClick={clearFilters}
          className="text-red-500 hover:underline w-full sm:w-auto text-center"
        >
          Clear Filters
        </button>
      </div>
  
      {/* Filters Section (Responsive Grid Layout) */}
      {showFilters && (
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg text-gray-800">
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
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              className="border p-2 rounded-md"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
  
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              className="border p-2 rounded-md"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
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
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
  
          {/* Apply & Close Buttons */}
          <div className="flex col-span-full justify-between gap-3 mt-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
              onClick={handleFilter}
            >
              Apply Filters
            </button>
            <button
              className="text-gray-500 underline px-4 py-2 w-full"
              onClick={() => setShowFilters(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
  
      {/* Responsive Table Container */}
      <div className="overflow-auto">
        <table className="w-full border-collapse border border-gray-300">
          {/* table content unchanged */}
        </table>
      </div>
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
