import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'

import Layout from './components/layout';
import Login from './routes/login';
import Register from './routes/register';
import Layout_Unauth from './components/layout_unauth';

import UserProfile from './routes/user_profile';
import PrivateRoute from './components/private_route';
import CreatePost from './routes/create_post';
import Home from './routes/home';
import Search from './routes/search';
import Settings from './routes/settings';

import { AuthProvider } from './contexts/useAuth';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<Layout><PrivateRoute><UserProfile/></PrivateRoute></Layout>} path='/:username' />
            <Route element={<Layout><PrivateRoute><CreatePost/></PrivateRoute></Layout>} path='/create_post' />
            <Route element={<Layout><PrivateRoute><Home/></PrivateRoute></Layout>} path='/' />
            <Route element={<Layout><PrivateRoute><Search/></PrivateRoute></Layout>} path='/search' />
            <Route element={<Layout><PrivateRoute><Settings/></PrivateRoute></Layout>} path='/update_user' />
            <Route element={<Layout_Unauth><Login/></Layout_Unauth>} path='/login' />
            <Route element={<Layout_Unauth><Register/></Layout_Unauth>} path='/register' />
          </Routes>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;