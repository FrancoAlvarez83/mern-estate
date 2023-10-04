import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js';

export const test = (req,res) => {
    res.json({
        message: 'Hello World!!',
    });
};


export const updatedUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401, 'You can only update your own account'))

    try {
        if(req.body.password){
            req.body.password = bcrypcjs.hashSycn(req.body.password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set:{
                userName: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, {new: true})

        const {password, ...rest} = updatedUser._doc;

        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
}