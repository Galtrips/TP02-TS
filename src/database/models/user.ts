import mongoose, {Document, Model} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import 'mongoose-type-email';

interface IUser extends Document{
    email: string;
    password: string,
}

const UsersSchema = new mongoose.Schema(
  {
    email: {
      //@ts-ignore
        type: mongoose.Types.Email,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
  }  
)

UsersSchema.plugin(uniqueValidator);
const UserModel: Model<IUser> = mongoose.model<IUser>('Users', UsersSchema);

export default UserModel;
export{
  UserModel,
  IUser
}  