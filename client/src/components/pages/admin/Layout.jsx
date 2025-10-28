import { Outlet } from 'react-router-dom'
import Sidebar from '../../Admin/Sidebar'
const Layout = () => {
  return (
    <div className='flex h-[calc(100vh-70px)]'>
      <div>
        <Sidebar />
      </div>
      <Outlet />
    </div>
  )
}

export default Layout
