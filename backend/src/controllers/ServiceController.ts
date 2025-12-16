import { Request, Response } from "express";
import { ServiceService } from "../services/ServiceService";

const serviceService = new ServiceService;

export class ServiceController {
    create = async (req: Request, res: Response) => {
        try {
            const service = await serviceService.create(req.body, req.file);
            res.status(201).json(service);
        } 
        catch(err: any) {
          res.status(400).json({messages: err.message})
        }
      }

    list = async (req: Request, res: Response) => {
        try {
            const services = await serviceService.list();
            res.json(services)
        }
        catch(err: any) {
            res.status(400).json({ message: err.message})
        }
    }

    update = async (req: Request, res: Response) => {
          try {
                const { id } = req.params;
                const service = await serviceService.update(Number(id), req.body)
                res.json(service)
            } catch (e: any) {
                res.status(400).json({ message: e.message })
            }
        }

    async delete(req: Request, res: Response) {
            try {
                const { id } = req.params
                const result = await serviceService.remove(Number(id))
                res.json(result)
            } catch (e: any) {
                res.status(404).json({ message: e.message })
            }
        }
}