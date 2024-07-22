import { NextFunction, Request, Response } from "express";

const Catch = (fn: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch((err: any) => {
      process.env.PROD === "false" && console.log(err);
      return res.status(500).json({
        success: false,
        message:
          process.env.PROD === "false"
            ? err.message
            : "Operation failed ! please try after some time.",
      });
    });
  };
};

export default Catch;
