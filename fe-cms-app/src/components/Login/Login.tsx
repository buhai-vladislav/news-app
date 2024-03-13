import { Input, Button } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import { EyeSlashFilledIcon, EyeFilledIcon } from '../../assets/icons';
import { useLogin } from './hooks/useLogin';
import './Login.scss';

export const Login = () => {
  const { formik, isVisible, toggleVisibility } = useLogin();

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col drop-shadow-lg"
    >
      <p className="text-xl font-bold text-center">Sign In</p>
      <Input
        color="primary"
        isInvalid={!!formik.errors.email}
        errorMessage={formik.errors.email}
        label="Email"
        onChange={formik.handleChange}
        name="email"
        value={formik.values.email}
      />
      <Input
        color="primary"
        errorMessage={formik.errors.password}
        isInvalid={!!formik.errors.password}
        label="Password"
        onChange={formik.handleChange}
        name="password"
        value={formik.values.password}
        type={isVisible ? 'text' : 'password'}
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
          >
            {isVisible ? <EyeSlashFilledIcon /> : <EyeFilledIcon />}
          </button>
        }
      />
      <Button type="submit" color="primary" isLoading={formik.isSubmitting}>
        Sign In
      </Button>
      <Link to="/signup">Don't have an account?</Link>
    </form>
  );
};
