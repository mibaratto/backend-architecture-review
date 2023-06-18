import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { UserDatabase } from "../database/UserDatabase";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/user/signup.dto";
import { TokenPayload, USER_ROLES, User } from "../models/User";


export class UserBusiness{
    constructor (
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager 
    ){}

    public signup = async (
        input: SignupInputDTO
        ): Promise<SignupOutputDTO> => {
        const { name, email, password } = input
        const id = this.idGenerator.generate()

        const hashedPassword = await this.hashManager.hash(password)
        
        const user = new User(
            id,
            name,
            email,
            hashedPassword,
            USER_ROLES.NORMAL,
            new Date().toISOString()
        )
        const userDB = user.toDBModel()
        await this.userDatabase.insertUser(userDB)
        
        const playload: TokenPayload = {
            id: user.getId(),
            name: user.getName(),
            role: user.getRole()
        }

        const token = this.tokenManager.createToken(playload)
        const output: SignupOutputDTO = {
            token
        }
        return output
    }
}