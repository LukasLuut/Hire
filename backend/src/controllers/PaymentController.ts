import { Request, Response } from "express";
import { PaymentService } from "../services/PaymentService";

const paymentService = new PaymentService;

export class PaymentController {
    create = async (req: Request, res: Response) => {
        try {
            const payment = await paymentService.create(req.body);
            res.status(201).json(payment);
        } 
        catch(err: any) {
          res.status(400).json({messages: err.message})
        }
      }

    list = async (req: Request, res: Response) => {
        try {
            const payments = await paymentService.list();
            res.json(payments)
        }
        catch(err: any) {
            res.status(400).json({ message: err.message})
        }
    }

    update = async (req: Request, res: Response) => {
          try {
                const { id } = req.params;
                const payment = await paymentService.update(Number(id), req.body)
                res.json(payment)
            } catch (e: any) {
                res.status(400).json({ message: e.message })
            }
        }

    delete = async (req: Request, res: Response) => {
            try {
                const { id } = req.params
                const result = await paymentService.remove(Number(id))
                res.json(result)
            } catch (e: any) {
                res.status(404).json({ message: e.message })
            }
        }

    getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const payment = await paymentService.getById(Number(id));
            res.json(payment);
        } catch (e: any) {
            res.status(400).json({ message: e.message })
        }
    }
}