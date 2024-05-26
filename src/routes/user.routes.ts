import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const newUser = await prisma.user.create({
      data: {
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@gmail.com',
        password: 'password',
        },
    })
    const allUsers = await prisma.user.findMany()
    console.log(allUsers)
  }

main()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })