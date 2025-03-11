import { Router } from 'express';
import {registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentUserPassword,getCurrentUser, updateAccountDetails,
updateUserAvatar, updateUserCover} from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middleware.js';
import {verifyJWT} from '../middlewares/auth.middleware.js';
const router = Router()
router.route('/register').post(
    upload.fields([
        {name: 'avatar', maxCount: 1},
        {name: 'coverImage', maxCount: 1}
    ]),
    registerUser
)

router.route('/login').post(loginUser);
router.route('/logout').post(verifyJWT,logoutUser);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/change-password').put(verifyJWT, changeCurrentUserPassword);
router.route('/get-current-user').get(verifyJWT,getCurrentUser);
router.route('/update-account-details').patch(verifyJWT, updateAccountDetails);
router.route('/update-avatar').patch(verifyJWT, upload.single('avatar'), updateUserAvatar);
router.route('/update-cover').patch(verifyJWT, upload.single('coverImage'), updateUserCover);
export default router

