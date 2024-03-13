import {
  Avatar,
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import { Link } from 'react-router-dom';
import { Logo } from '../../assets/icons';
import './Header.scss';
import { useHeader } from './hooks/useHeader';

export const Header = () => {
  const { user, logoutHandler, handleNavigate, isLoading, tabs, handleActive } =
    useHeader();

  return (
    <Navbar isBordered className="header">
      <NavbarBrand>
        <Logo />
        <Link to="/">
          <p className="font-bold text-inherit"></p>
        </Link>
      </NavbarBrand>
      <NavbarContent>
        {!user ? (
          <>
            <Button variant="ghost" onClick={handleNavigate('/login')}>
              Sign In
            </Button>
            <Button variant="ghost" onClick={handleNavigate('/signup')}>
              Sign Up
            </Button>
          </>
        ) : (
          <>
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                variant={handleActive(tab.key) ? 'solid' : 'bordered'}
                color="primary"
                onPress={handleNavigate(tab.key)}
              >
                {tab.title}
              </Button>
            ))}
            <Popover placement="left">
              <PopoverTrigger>
                <Avatar
                  name={user.fullname}
                  isBordered
                  radius="sm"
                  src={
                    typeof user.avatar === 'string'
                      ? user.avatar
                      : user.avatar?.fileSrc
                  }
                  style={{ cursor: 'pointer' }}
                />
              </PopoverTrigger>
              <PopoverContent>
                <Button
                  size="sm"
                  className="w-full"
                  style={{ marginBottom: '5px' }}
                  onPress={logoutHandler}
                  disabled={isLoading}
                  isLoading={isLoading}
                  variant="flat"
                >
                  Logout
                </Button>
                <Button
                  size="sm"
                  onPress={handleNavigate(`/users/${user.id}`)}
                  disabled={isLoading}
                  isLoading={isLoading}
                  variant="flat"
                >
                  Update user
                </Button>
              </PopoverContent>
            </Popover>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};
