// authController.js
import { userSchema } from './app.schema.js'
import  mongoose  from 'mongoose'
const User = mongoose.model("user", userSchema)

export const createUser = async (email, password) => {
    try {
        const user = new User({ email, password });
        await user.save();
        return user;
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
};

export const findUserByEmail = async (email) => {
    try {
        return await User.findOne({ email });
    } catch (error) {
        throw new Error('Error finding user: ' + error.message);
    }
};

export const checkPassword = async (email, password) => {
    try {
        const user = await findUserByEmail(email);
        if (!user) return false;
        return await user.comparePassword(password);
    } catch (error) {
        throw new Error('Error checking password: ' + error.message);
    }
};

export const generatePasswordResetToken = async (email) => {
    try {
        const user = await findUserByEmail(email);
        if (!user) throw new Error('User not found');
        
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
        
        await user.save();
        return resetToken;
    } catch (error) {
        throw new Error('Error generating password reset token: ' + error.message);
    }
};

export const resetPassword = async (resetToken, newPassword) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) throw new Error('Invalid or expired reset token');
        
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        await user.save();
        return user;
    } catch (error) {
        throw new Error('Error resetting password: ' + error.message);
    }
}
