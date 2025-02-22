import jwt from 'jsonwebtoken'

class Jwt {
  constructor() {}

  public generateToken(payload: string, secret: string): string {
    return jwt.sign(payload, secret)
  }

  public verifyToken(token: string, secret: string): boolean {
    try {
      jwt.verify(token, secret)
      return true
    } catch (error) {
      return false
    }
  }
}

export default Jwt