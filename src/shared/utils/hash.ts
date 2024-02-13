import bcrypt from 'bcrypt';

export const generatePasswordHash = async (
  password: string,
): Promise<string | null> => {
  const rounds = process.env.SALT_ROUNDS;

  if (!rounds) {
    throw new Error('Salt rounds undefine in the enviroment');
  }

  const saltRounds = Number.parseInt(rounds);
  const hash = await bcrypt.hash(password, saltRounds);

  return !hash ? null : hash;
};

export const checkPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  const match = await bcrypt.compare(password, hash.toString());

  return match;
};
