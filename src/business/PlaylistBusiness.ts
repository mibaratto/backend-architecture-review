
import { PlaylistDatabase } from "../database/PlaylistDatabase";
import { CreatePlaylistInputDTO, CreatePlaylistOutputDTO } from "../dtos/playlist/createPlaylist.dto";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Playlist } from "../models/Playlist";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { GetPlaylistsInputDTO, GetPlaylistsOutputDTO } from "../dtos/playlist/getPlaylists.dto";
import { EditPlaylistInputDTO, EditPlaylistOutputDTO } from "../dtos/playlist/editPlaylist.dto";
import { NotFoundError } from "../errors/NotFoundError";
import { ForbiddenError } from "../errors/ForbiddenError";

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

      public editPlaylist = async (
        input: EditPlaylistInputDTO
    ): Promise<EditPlaylistOutputDTO> => {
        const { name, token, idToEdit} = input

        const payload = this.tokenManager.getPayload(token)

        if(!payload) {
            throw new UnauthorizedError()
        }

        const playlistDB = await this.playlistDatabase.findPlaylistById(idToEdit)

        if(!playlistDB) {
            throw new NotFoundError("playlist with this id not found")
        }

        if (payload.id !== playlistDB.creator_id) {
            throw new ForbiddenError("only the creator of the playlist can edit it")
        }

        const playlist = new Playlist(
            playlistDB.id,
            playlistDB.name,
            playlistDB.likes,
            playlistDB.dislikes,
            playlistDB.created_at,
            playlistDB.updated_at,
            playlistDB.creator_id,
            payload.name
        )

        playlist.setName(name)

        const updatedPlaylistDB = playlist.toDBModel()
        await this.playlistDatabase.updatePlaylist(updatedPlaylistDB)

        const output: EditPlaylistOutputDTO = undefined
        return output
    }
}