import bcrypt from "bcrypt"

export async function hashPassword(plainPassword){
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(plainPassword,saltRounds)
    return hashPassword;
}

export async function comparePassword(password, userPassword) {
    return (await bcrypt.compare(password,userPassword))
}
