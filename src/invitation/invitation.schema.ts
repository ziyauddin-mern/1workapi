import {
  Schema,
  model
} from "mongoose"

const modelSchema = new Schema({

}, {
  timestamps: true
});

const InvitationSchema = model("Invitation", modelSchema)
export default InvitationSchema