import { createBrotliDecompress } from "zlib";
import { PlaylistDatabase } from "../database/PlaylistDatabase";
import { CreatePlaylistInputDTO, CreatePlaylistOutputDTO } from "../dtos/playlist/createPlaylist.dto";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Playlist } from "../models/Playlist";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PlaylistBusiness {
    constructor(
        private playlistDatabse: PlaylistDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ){}
    public createPlaylist = async (
        input: CreatePlaylistInputDTO
    ): Promise<CreatePlaylistOutputDTO> => {
        const { name, token} = input

        const playload = this.tokenManager.getPayload(token)

        if(!playload) {
            throw new UnauthorizedError()
        }

        const id = this.idGenerator.generate()
        const playlist = new Playlist(
            id,
            name,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            playload.id,
            playload.name
        )
        const playlistDB = playlist.toDBModel()
        await this.playlistDatabse.insertPlaylist(playlistDB)
    }
}