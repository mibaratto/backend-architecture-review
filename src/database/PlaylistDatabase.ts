import { PlaylistDB } from "../models/Playlist";
import { BaseDatabase } from "./BaseDatabase";

export class PlaylistDatabase extends BaseDatabase{
    public static TABLE_PLAYLISTS = "playlists"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes"

    public insertPlaylist = async (
        playlistDB: PlaylistDB
    ): Promise<void> => {
        await BaseDatabase
        .connection(PlaylistDatabase.TABLE_PLAYLISTS)
        .insert(playlistDB)  
    }
}