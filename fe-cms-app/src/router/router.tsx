import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout/RootLayout';
import { Login } from '../components/Login';
import { SignUp } from '../components/SignUp';
import { UsersPage } from '../pages/Users';
import { TagsPage } from '../pages/Tags';
import { UpdateUserPage } from '../pages/UpdateUser';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        index: true,
        element: <>Home</>,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <SignUp />,
      },
      {
        path: '/posts',
        element: <>Posts</>,
      },
      {
        path: '/users',
        element: <UsersPage />,
      },
      {
        path: '/users/:userId',
        element: <UpdateUserPage />,
      },
      {
        path: '/tags',
        element: <TagsPage />,
      },
    ],
  },
]);
