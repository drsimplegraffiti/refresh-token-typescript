import {
    DocumentType,
    Severity,
    getModelForClass,
    index,
    modelOptions,
    pre,
    prop,
} from '@typegoose/typegoose';
import bcrypt from 'bcryptjs';
import { emailVerificationToken } from '../utils/jwt';

@index({ email: 1 })
    @pre<User>('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
})
@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
    options: {
        allowMixed: Severity.ALLOW,
    },
})

export class User {
    @prop()
    name: string;

    @prop({ unique: true, required: true })
    email: string;

    @prop({ required: true, minlength: 8, maxLength: 32, select: false })
    password: string;

    @prop({ default: 'user' })
    role: string;

    @prop({ default: false })
    verified: boolean;

    @prop({ required: true, default: () => emailVerificationToken() })
    verificationToken: string | undefined;

    @prop({ default: undefined })
    passwordResetToken: string | undefined;

    @prop({ default: null })
    passwordResetTokenExpiresAt: Date | null;

    @prop({ default: null })
    passwordChangedAt: Date | null;

    @prop()
    profilePicture: string;

    async comparePasswords(hashedPassword: string, candidatePassword: string) {
        return await bcrypt.compare(candidatePassword, hashedPassword);
    }
}

const userModel = getModelForClass(User);
export default userModel;
