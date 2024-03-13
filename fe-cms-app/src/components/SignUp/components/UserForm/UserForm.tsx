import { Input } from '@nextui-org/react';
import './UserForm.scss';
import { FC, useCallback, useState } from 'react';
import { UserFormProps } from './UserForm.props';
import { EyeFilledIcon, EyeSlashFilledIcon } from '../../../../assets/icons';

export const UserForm: FC<UserFormProps> = ({ formik }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  return (
    <div className="form__wrapper">
      <Input
        fullWidth
        color="primary"
        size="lg"
        label="Full Name"
        name="fullname"
        onChange={formik.handleChange}
        value={formik.values.fullname}
        isInvalid={!!formik.errors.fullname}
        errorMessage={formik.errors.fullname}
      />
      <Input
        fullWidth
        color="primary"
        size="lg"
        label="Email"
        name="email"
        onChange={formik.handleChange}
        value={formik.values.email}
        isInvalid={!!formik.errors.email}
        errorMessage={formik.errors.email}
      />
      <Input
        fullWidth
        color="primary"
        size="lg"
        label="Password"
        name="password"
        type={isVisible ? 'text' : 'password'}
        onChange={formik.handleChange}
        value={formik.values.password}
        isInvalid={!!formik.errors.password}
        errorMessage={formik.errors.password}
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
      <Input
        fullWidth
        color="primary"
        size="lg"
        label="Confirm Password"
        name="confirmPassword"
        type={isVisible ? 'text' : 'password'}
        onChange={formik.handleChange}
        value={formik.values.confirmPassword}
        isInvalid={!!formik.errors.confirmPassword}
        errorMessage={formik.errors.confirmPassword}
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
    </div>
  );
};
