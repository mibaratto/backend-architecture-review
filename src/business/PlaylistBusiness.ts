import { PlaylistDatabase } from "../database/PlaylistDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PlaylistBusiness {
    constructor(
        private playlistDatabse: PlaylistDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ){}
    //endpoints
}