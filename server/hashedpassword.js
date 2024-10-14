// hashPassword.js
import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
    const saltRounds = 10; // You can adjust the salt rounds for security
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

const main = async () => {
    const password = "Password123"; // Replace with the password you want to hash
    const hashedPassword = await hashPassword(password);
    console.log("Hashed Password:", hashedPassword);
};

main().catch(console.error);