import { AxiosInstance } from "axios"
import Jwt from "../utils/JWT"
import 'dotenv/config'

const jwt = new Jwt()

class DbService {
  private axios: AxiosInstance | null

  constructor(axios: AxiosInstance) {
    this.axios = axios
  }

  public async sendToDatabase(payload: string): Promise<void> {
    const token = jwt.generateToken('MQ-DATA', process.env.jwt_secret as string)
    
    try {
      await this.axios?.post('/api/dbmanager/insert', { data: payload }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
    } catch (error: any) {
      console.log(error)
      throw new Error(error)
    }
  }
}

export default DbService