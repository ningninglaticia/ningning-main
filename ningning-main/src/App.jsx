import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login';
import SignUp from './pages/Signup/SignUp';
import UploadForm from './components/Input/UploadForm';
import MyDocuments from './pages/MyDocuments/MyDocuments';

const routes = (

  <Router>
    <Routes>
    <Route path='/login' exact element={<Login />} />
      <Route path='/' exact element={<Home />} />
      <Route path='/signup' exact element={<SignUp />} />
      <Route path="/edit-document" element={<UploadForm />} />
      <Route path="/my-documents" element={<MyDocuments />} />
    </Routes>
  </Router>
);

const App = () => {
  return (
    <div>
      {routes}
    </div>
  )
}

export default App
