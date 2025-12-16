import { Request, Response } from "express";
import { HireService } from "../services/HireService";

const hireService = new HireService;

export class HireController {
    create = async (req: Request, res: Response) => {
        try {
            const firstContact: Date = new Date();
            const body = {...req.body, firstContact}

            const hire = await hireService.create(body);
            res.status(201).json(hire);
        } 
        catch(err: any) {
          res.status(400).json({messages: err.message})
        }
      }

    list = async (req: Request, res: Response) => {
        try {
            const hires = await hireService.list();
            res.json(hires)
        }
        catch(err: any) {
            res.status(400).json({ message: err.message})
        }
    }

    update = async (req: Request, res: Response) => {
          try {
                const { id } = req.params;
                const hire = await hireService.update(Number(id), req.body)
                res.json(hire)
            } catch (e: any) {
                res.status(400).json({ message: e.message })
            }
        }

    async delete(req: Request, res: Response) {
            try {
                const { id } = req.params
                const result = await hireService.remove(Number(id))
                res.json(result)
            } catch (e: any) {
                res.status(404).json({ message: e.message })
            }
        }
}