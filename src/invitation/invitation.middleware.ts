import { NextFunction, Request, Response } from "express";
import Catch from "../../lib/catch.lib";
import { fetchUserByEmail } from "../user/user.controller";
import { fetchInvitationByMemberId } from "./invitation.controller";

const InvitationMeddleware = Catch(
  async (req: Request, res: Response, next: NextFunction) => {
    let member = null;

    const user = await fetchUserByEmail(req, res, next);
    req.params.memberId = user._id;

    req.query.status = "invited";
    member = await fetchInvitationByMemberId(req, res, next);
    if (member) throw new Error("Failed to send invitation");

    req.query.status = "rejected";
    member = await fetchInvitationByMemberId(req, res, next);
    if (member) return next();

    req.query.status = "accepted";
    member = await fetchInvitationByMemberId(req, res, next);
    if (member) throw new Error("Failed to send invitation");

    next();
  }
);
export default InvitationMeddleware;
