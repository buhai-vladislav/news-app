export enum FormStep {
  FORM = 'form',
  AVATAR = 'avatar',
}

export type UserDataFormValues = {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
};
