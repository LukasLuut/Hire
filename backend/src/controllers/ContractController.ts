import { Request, Response } from "express";
import { ContractService } from "../services/ContractService";

const contractService = new ContractService;

export class ContractController {
    create = async (req: Request, res: Response) => {
        try {
            const firstContact: Date = new Date();
            const lastContact: Date = new Date();
            const body = {...req.body, firstContact, lastContact}
            const contract = await contractService.create(body);
            res.status(201).json(contract);
        } 
        catch(err: any) {
          res.status(400).json({messages: err.message})
        }
      }

    list = async (req: Request, res: Response) => {
        try {
            const categories = await contractService.list();
            res.json(categories)
        }
        catch(err: any) {
            res.status(400).json({ message: err.message})
        }
    }

    update = async (req: Request, res: Response) => {
          try {
                const { id } = req.params;
                const category = await contractService.update(Number(id), req.body)
                res.json(category)
            } catch (e: any) {
                res.status(400).json({ message: e.message })
            }
        }

    delete = async (req: Request, res: Response) => {
            try {
                const { id } = req.params
                const result = await contractService.remove(Number(id))
                res.json(result)
            } catch (e: any) {
                res.status(404).json({ message: e.message })
            }
        }

    getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const category = await contractService.getById(Number(id));
            res.json(category);
        } catch (e: any) {
            res.status(400).json({ message: e.message})
        }
    }
}