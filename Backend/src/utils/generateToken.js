import jwt from 'jsonwebtoken';

const generateToken = (id, expiresIn = process.env.JWT_EXPIRATION || '30d') => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn
  });
};

export default generateToken;