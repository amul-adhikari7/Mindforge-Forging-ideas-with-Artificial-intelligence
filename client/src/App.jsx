import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/pages/Home.jsx'
import Blog from './components/pages/Blog.jsx'
import Blogs from './pages/Blogs.jsx'
import Moments from './pages/Moments.jsx'
import Navbar from './components/Navbar.jsx'
import Layout from './components/pages/admin/Layout.jsx'
import Dashboard from './components/pages/admin/Dashboard.jsx'
import AddBlog from './components/pages/admin/AddBlog.jsx'
import ListBlog from './components/pages/admin/ListBlog.jsx'
import Comments from './components/pages/admin/Comments.jsx'
import Login from './components/Admin/Login.jsx'
import 'quill/dist/quill.snow.css'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from '../context/AppContext.jsx'

const App = () => {
  const { token } = useAppContext()
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/blogs' element={<Blogs />} />
        <Route path='/blog/:id' element={<Blog />} />
        <Route path='/moments' element={<Moments />} />
        <Route path='/admin/login' element={<Login />} />
        <Route path='/login' element={<Login />} />

        {/* Admin Routes */}
        <Route
          path='/admin/*'
          element={token ? <Layout /> : <Navigate to='/admin/login' />}
        >
          <Route path='' element={<Dashboard />} />
          <Route path='blogs' element={<Blogs />} />
          <Route path='moments' element={<Moments />} />
          <Route path='addBlog' element={<AddBlog />} />
          <Route path='listBlog' element={<ListBlog />} />
          <Route path='comments' element={<Comments />} />
        </Route>
      </Routes>

      <Toaster position='top-right' reverseOrder={false} />
    </>
  )
}

export default App
