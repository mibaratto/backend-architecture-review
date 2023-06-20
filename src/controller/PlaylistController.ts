import { Request, Response } from "express";
import { PlaylistBusiness } from "../business/PlaylistBusiness";
import { ZodError } from "zod";
import { BaseError } from "../errors/BaseError";
import { CreatePlaylistSchema } from "../dtos/playlist/createPlaylist.dto";
import { GetPlaylistsSchema } from "../dtos/playlist/getPlaylists.dto";

export class PlaylistController {
    constructor(
        private playlistBusiness: PlaylistBusiness
    ) { }

    
    public createPlaylist = async (req: Request, res: Response) => {
        try {
            const input = CreatePlaylistSchema.parse({
                name: req.body.name,
                token: req.headers.authorization
            })

            const output = await this.playlistBusiness.createPlaylist(input)
            res.status(201).send(output)

        } catch (error) {
            console.log(error)

            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("unexpected error")
            }
        }
    }

    public getPlaylists = async (req: Request, res: Response) => {
        try {
            const input = GetPlaylistsSchema.parse({
                token: req.headers.authorization
            })
            const output = await this.playlistBusiness.getPlaylists(input)
            res.status(200).send(output)
            
        } catch (error) {
            console.log(error)

            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("unexpected error")
            }
        }
    }
}