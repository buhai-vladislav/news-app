import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../shared/types';

const initialState: Partial<Record<'user', IUser | undefined>> = {
  user: undefined,
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    resetUser: (state) => {
      state.user = undefined;
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
