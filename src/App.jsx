import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import PostDetail from './pages/PostDetail'

function App() {
  return (
    <Router>
      <div className='min-h-screen bg-gray-50'>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/create' element={ <ProtectedRoute> <CreatePost/> </ProtectedRoute> } />
          <Route path='/signup' element={ <Signup/> } />
          <Route path='/login' element={ <Login/> } />
          <Route path='/post/:id' element={<PostDetail/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
