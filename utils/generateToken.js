import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn:'30d',
    });


    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })

    return token
};




// Updated generateToken function
// const generateToken = (res, userId, storageType = 'auto') => {
//     const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//         expiresIn: '30d',
//     });
//     console.log("tokkkken", token);

//     if (storageType === 'auto') {
//         if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
//             // Client-side environment with localStorage support
//             localStorage.setItem('jwt', token);
//         } else if (res) {
//             // Server-side environment or client-side without localStorage support
//             res.cookie('jwt', token, {
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV !== 'development',
//                 sameSite: 'strict',
//                 maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
//             });
//         } else {
//             throw new Error('Invalid environment. Unable to set token.');
//         }
//     } else if (storageType === 'localStorage' && typeof window !== 'undefined') {
//         // Explicitly specify localStorage
//         localStorage.setItem('jwt', token);
//     } else if (storageType === 'cookie' && res) {
//         // Explicitly specify cookie and ensure res is provided
//         res.cookie('jwt', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV !== 'development',
//             sameSite: 'strict',
//             maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
//         });
//     } else {
//         throw new Error(`Invalid storage type specified: ${storageType}`);
//     }

//     return token;
// };




export default generateToken;