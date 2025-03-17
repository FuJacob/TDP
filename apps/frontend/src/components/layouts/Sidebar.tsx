import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/wouessi-new-logo.png";

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Keep dropdown open if user is in Lead Generation or its sub-pages

  return (
    <nav className="w-64 bg-gray-800 text-white p-5 space-y-4">
      <img src={logo} alt="Wouessi Logo" className="w-32 h-auto" />
      <ul className="space-y-3">
        <li>
          <Link to="/tenderdata" className="block p-3 bg-gray-700 rounded">
            Tender Data
          </Link>
        </li>
        <li>
          <button
            onClick={() => {
              navigate("/lg");
              setIsDropdownOpen((prev) => !prev)} // Strictly toggles dropdown
            }
            className="w-full text-left p-3 bg-gray-700 rounded flex justify-between"
          >
            Lead Generation
            <span>{isDropdownOpen ? "▲" : "▼"}</span>
          </button>

          {/* Dropdown Appears Below "Lead Generation" */}
          {isDropdownOpen && (
            <ul className="ml-4 mt-2 bg-gray-700 rounded">
              <li>
                <Link
                  to="/tendersearch"
                  className="block p-3 hover:bg-gray-600 rounded"
                  onClick={() => setIsDropdownOpen(true)}
                >
                  Tender Search
                </Link>
              </li>
              <li>
                <Link
                  to="/ai-tendersearch"  // FOR FUTURE: edit to the actual path
                  className="block p-3 hover:bg-gray-600 rounded"
                  onClick={() => setIsDropdownOpen(true)}
                >
                  AI Tender Search
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link to="/ca" className="block p-3 bg-gray-700 rounded">
            Capability Assessment
          </Link>
        </li>
        <li>
          <Link to="/bm" className="block p-3 bg-gray-700 rounded">
            Benchmarking
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
