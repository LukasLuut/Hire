import { Request, Response } from "express";
import { CategoryService } from "../services/CategoryService";

const categoryService = new CategoryService;

export class CategoryController {
    create = async (req: Request, res: Response) => {
        try {
            const category = await categoryService.create(req.body);
            res.status(201).json(category);
        } 
        catch(err: any) {
          res.status(400).json({messages: err.message})
        }
      }

    list = async (req: Request, res: Response) => {
        try {
            const categories = await categoryService.list();
            res.json(categories)
        }
        catch(err: any) {
            res.status(400).json({ message: err.message})
        }
    }

    update = async (req: Request, res: Response) => {
          try {
                const { id } = req.params;
                const category = await categoryService.update(Number(id), req.body)
                res.json(category)
            } catch (e: any) {
                res.status(400).json({ message: e.message })
            }
        }

    async delete(req: Request, res: Response) {
            try {
                const { id } = req.params
                const result = await categoryService.remove(Number(id))
                res.json(result)
            } catch (e: any) {
                res.status(404).json({ message: e.message })
            }
        }

    getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const category = await categoryService.getById(Number(id));
            res.json(category);
        } catch (e: any) {
            res.status(400).json({ message: e.message})
        }
    }
}