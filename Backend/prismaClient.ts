import { PrismaClient } from '@prisma/client'
import waitPort from 'wait-port'

waitPort({
    host:'db',  // Use the service name defined in Docker Compose
    port:3306,  // MySQL default port
    timeout:60000
})

const prisma = new PrismaClient()

export { prisma }