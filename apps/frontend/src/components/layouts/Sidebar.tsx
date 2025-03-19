import { Link } from 'react-router-dom'
import logo from '../../assets/wouessi-new-logo.png'
import { FaUser } from 'react-icons/fa'
import { useAuth } from '../../auth/components/AuthContext'
import  Icon  from "../Icon/Icon"

const Sidebar = () => {
  const { auth } = useAuth()

  return (
    <nav className="w-64 bg-gray-800 text-white p-8 space-y-4">
      <img src={logo} alt="Wouessi Logo" className="w-32 h-auto" />
      <div className="w-full h-0.5 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700"></div>
      <div className="flex flex-col justify-between h-[75vh]">
        <div>
          <ul className="space-y-3">
            <li>
              <Link to="/tenderdata" className="block p-3 bg-gray-700 rounded">
                Tender Data
              </Link>
            </li>
            <li>
              <Link to="/lg" className="block p-3 bg-gray-700 rounded">
                Lead Generation
              </Link>
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
        </div>
        <div className="p-4 ">
          <div className="flex justify-right items-center">
            {auth.isAuthenticated ? (
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-gray-500 to-gray-500 text-white flex items-center justify-center text-[15px] font-semibold mr-[8px]">
                {auth.user.name.charAt(0)}
              </div>
            ) : (
              <FaUser className="text-gray-500 text-[12px] mr-[8px]" />
            )}

            <div className="text-[12px] font-normal text-gray-500">
              {auth.isAuthenticated ? auth.user.name : 'Name'}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
