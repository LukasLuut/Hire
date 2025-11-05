import { Request, Response } from "express";
import { ProviderService } from "../services/ProviderService";

const providerService = new ProviderService;

export class ProviderController {
    create = async (req: Request, res: Response) => {
        try {
            const provider = await providerService.create((req as any).user.id, req.body);
            res.status(201).json(provider);
        } 
        catch(err: any) {
          res.status(400).json({messages: err.message})
        }
      }

    getById = async (req: Request, res: Response) => {
      try {
        const provider = await providerService.getById((req as any).user.id);
        res.status(201).json(provider);
      } catch(err: any) {
        res.status(400).json({messages: err.message})
      } 
    }

    async delete(req: Request, res: Response) {
            try {
                const result = await providerService.remove((req as any).user.id)
                res.json(result)
            } catch (e: any) {
                res.status(404).json({ message: e.message })
            }
        }

    list = async (req: Request, res: Response) => {
        try {
            const providers = await providerService.list();
            res.json(providers)
        }
        catch(err: any) {
            res.status(400).json({ message: err.message})
        }
    }

    update = async (req: Request, res: Response) => {
          try {
                const { id } = req.params;
                const category = await providerService.update((req as any).user.id, req.body)
                res.json(category)
            } catch (e: any) {
                res.status(400).json({ message: e.message })
            }
        }

    // async delete(req: Request, res: Response) {
    //         try {
    //             const { id } = req.params
    //             const result = await categoryService.remove(Number(id))
    //             res.json(result)
    //         } catch (e: any) {
    //             res.status(404).json({ message: e.message })
    //         }
    //     }
}