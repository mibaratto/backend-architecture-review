
import { PlaylistDatabase } from "../database/PlaylistDatabase";
import { CreatePlaylistInputDTO, CreatePlaylistOutputDTO } from "../dtos/playlist/createPlaylist.dto";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Playlist } from "../models/Playlist";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { GetPlaylistsInputDTO, GetPlaylistsOutputDTO } from "../dtos/playlist/getPlaylists.dto";

export class PlaylistBusiness {
    constructor(
        private playlistDatabase: PlaylistDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ){}
    public createPlaylist = async (
        input: CreatePlaylistInputDTO
    ): Promise<CreatePlaylistOutputDTO> => {
        const { name, token} = input

        const payload = this.tokenManager.getPayload(token)

        if(!payload) {
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
            payload.id,
            payload.name
        )
        const playlistDB = playlist.toDBModel()
        await this.playlistDatabase.insertPlaylist(playlistDB)

        const output: CreatePlaylistOutputDTO = undefined

        return output
    }

    public getPlaylists = async (
        input: GetPlaylistsInputDTO
      ): Promise<GetPlaylistsOutputDTO> => {
        const { token } = input
    
        const payload = this.tokenManager.getPayload(token)
    
        if (!payload) {
          throw new UnauthorizedError()
        }
    
        const playlistsDBwithCreatorName =
          await this.playlistDatabase.getPlaylistsWithCreatorName()
        
        const playlists = playlistsDBwithCreatorName
          .map((playlistWithCreatorName) => {
            const playlist = new Playlist(
              playlistWithCreatorName.id,
              playlistWithCreatorName.name,
              playlistWithCreatorName.likes,
              playlistWithCreatorName.dislikes,
              playlistWithCreatorName.created_at,
              playlistWithCreatorName.updated_at,
              playlistWithCreatorName.creator_id,
              playlistWithCreatorName.creator_name
            )
    
            return playlist.toBusinessModel()
        })
    
        const output: GetPlaylistsOutputDTO = playlists
    
        return output
      }
}