import { Input, Select, SelectItem } from '@nextui-org/react';
import { UserRole } from '../../../../../../shared/types';
import { FC, useState } from 'react';
import type { UserFormProps } from './UserForm.props';

import './UserFrom.scss';
import {
  EyeSlashFilledIcon,
  EyeFilledIcon,
} from '../../../../../../assets/icons';

export const UserForm: FC<UserFormProps> = ({ formik }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
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
      <Select
        label="Select a role"
        className="max-w-xs select-user-role"
        name="role"
        value={formik.values.role}
        onChange={formik.handleChange}
        color="primary"
        isInvalid={!!formik.errors.role}
        errorMessage={formik.errors.role}
      >
        {Object.entries(UserRole).map(([key, role]) => (
          <SelectItem key={key} value={role} className="capitalize">
            {key.toLowerCase()}
          </SelectItem>
        ))}
      </Select>
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
    </form>
  );
};
