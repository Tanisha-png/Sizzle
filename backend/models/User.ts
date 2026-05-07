import mongoose, {Schema, Document} from "mongoose";

//? Define the User Interface for TypeScript
export interface IUser extends Document {
    username: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
});

export default mongoose.model<IUser>("User", UserSchema);