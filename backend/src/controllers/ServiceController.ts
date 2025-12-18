import { Request, Response } from "express";
import { ServiceService } from "../services/ServiceService";

const serviceService = new ServiceService;

function toBoolean(value: any): boolean {
  return value === true || value === "true" || value === "1" || value === 1;
}

export class ServiceController {
    create = async (req: Request, res: Response) => {
        try {
            const {
                negotiable,
                requiresScheduling
            } = req.body;

            const body = {
                ...req.body,
                negotiable: toBoolean(negotiable),
                requiresScheduling: toBoolean(requiresScheduling),
            };

            const service = await serviceService.create(body, req.file);
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

    getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const services = await serviceService.getById(Number(id));
            res.json(services)
        }
        catch(err: any) {
            res.status(400).json({ message: err.message})
        }
    }

    update = async (req: Request, res: Response) => {
          try {
                const {
                    negotiable,
                    requiresScheduling
                } = req.body;

                const body = {
                    ...req.body,
                    negotiable: toBoolean(negotiable),
                    requiresScheduling: toBoolean(requiresScheduling),
                };

                const { id } = req.params;
                const service = await serviceService.update(Number(id), body)
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