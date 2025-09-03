import {asyncHandler}  from '../utils/asyncHandler.js';

const registerUser = asyncHandler(async (req, res) => {
    // Registration logic 
    res.status(201).json({ message: 'User registered successfully' });
});

const loginUser = asyncHandler(async (req, res) => {
    // Login logic
    res.status(200).json({ message: 'User logged in successfully' });
});

export { registerUser, loginUser };
