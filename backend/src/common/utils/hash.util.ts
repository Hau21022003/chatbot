import * as bcrypt from 'bcrypt';

export async function hashData(data: string): Promise<string> {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(data, salt);
}

export async function compareHash(data: string, hash: string): Promise<boolean> {
  return bcrypt.compare(data, hash);
}