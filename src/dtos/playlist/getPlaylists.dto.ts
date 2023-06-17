import { PlaylistModel } from "../../models/Playlist"
import z from 'zod'

export interface GetPlaylistsInputDTO{
    token: string
}

export type GetPlaylistsOutDTO = PlaylistModel[]

export const GetPlaylistsSchema = z.object({
    token: z.string().min(1)
}).transform(data => data as GetPlaylistsInputDTO)