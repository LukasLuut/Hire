import { Request, Response } from "express";
import { PaymentService } from "../services/PaymentService";

const paymentService = new PaymentService;

export class PaymentController {
    create = async (req: Request, res: Response) => {
        try {
            const category = await paymentService.create(req.body);
            res.status(201).json(category);
        } 
        catch(err: any) {
          res.status(400).json({messages: err.message})
        }
      }

    list = async (req: Request, res: Response) => {
        try {
            const categories = await paymentService.list();
            res.json(categories)
        }
        catch(err: any) {
            res.status(400).json({ message: err.message})
        }
    }

    // update = async (req: Request, res: Response) => {
    //       try {
    //             const { id } = req.params;
    //             const category = await paymentService.update(Number(id), req.body)
    //             res.json(category)
    //         } catch (e: any) {
    //             res.status(400).json({ message: e.message })
    //         }
    //     }

    // async delete(req: Request, res: Response) {
    //         try {
    //             const { id } = req.params
    //             const result = await paymentService.remove(Number(id))
    //             res.json(result)
    //         } catch (e: any) {
    //             res.status(404).json({ message: e.message })
    //         }
    //     }
}