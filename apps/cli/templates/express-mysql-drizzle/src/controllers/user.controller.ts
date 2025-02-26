import type { Request, Response } from "express";

export const getUsers = async (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: "Get all users" });
};