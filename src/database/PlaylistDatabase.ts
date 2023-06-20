import { PlaylistDB, PlaylistDBWithCreatorName } from "../models/Playlist";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PlaylistDatabase extends BaseDatabase {
    public static TABLE_PLAYLISTS = "playlists"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes"

    public insertPlaylist = async (
        playlistDB: PlaylistDB
    ): Promise<void> => {
        await BaseDatabase
            .connection(PlaylistDatabase.TABLE_PLAYLISTS)
            .insert(playlistDB)
    }

    public getPlaylistsWithCreatorName =
    async (): Promise<PlaylistDBWithCreatorName[]> => {

    const result = await BaseDatabase
      .connection(PlaylistDatabase.TABLE_PLAYLISTS)  
      .select(
        `${PlaylistDatabase.TABLE_PLAYLISTS}.id`,
        `${PlaylistDatabase.TABLE_PLAYLISTS}.creator_id`,
        `${PlaylistDatabase.TABLE_PLAYLISTS}.name`,
        `${PlaylistDatabase.TABLE_PLAYLISTS}.likes`,
        `${PlaylistDatabase.TABLE_PLAYLISTS}.dislikes`,
        `${PlaylistDatabase.TABLE_PLAYLISTS}.created_at`,
        `${PlaylistDatabase.TABLE_PLAYLISTS}.updated_at`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${PlaylistDatabase.TABLE_PLAYLISTS}.creator_id`, 
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      )
    return result as PlaylistDBWithCreatorName[]
  }


  public findPlaylistById = async (
    id: string
    ): Promise<PlaylistDB | undefined> => {
    const [result] = await BaseDatabase
        .connection(PlaylistDatabase.TABLE_PLAYLISTS)
        .select()
        .where({ id })

    return result as PlaylistDB | undefined
  }


  public updatePlaylist = async (
    playlistDB: PlaylistDB
    ): Promise<void> => {
        await BaseDatabase
            .connection(PlaylistDatabase.TABLE_PLAYLISTS)
            .update(playlistDB)
            .where({ id: playlistDB.id })
    }

}
