const { integer, text, boolean, pgTable, uuid, timestamp } = require("drizzle-orm/pg-core");
const { access } = require("fs/promises");



export const user = pgTable("user",{
    id: uuid("id").primaryKey().defaultRandom(),
    username: text("username").notNull().unique(),
    avatar: text("avatar").notNull(),
    email: text('email').notNull(),
    password: text('password').notNull(),
    refreshToken: text('refreshToken').default(''),
    accessToken: text('accessToken').default('')
})

export const chat = pgTable('chat', {
    id: uuid('id').primaryKey().defaultRandom(),
    senderId: uuid('senderId').references(() => user.id).notNull(), 
    receiverId: uuid('receiverId').references(() => user.id).notNull(),
    content: text('content'),
    isFile: boolean('isFile').default(false),
    file: text('file'),
    isRead: boolean('isRead').default(false),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
})

export const block = pgTable('block',{
    id:uuid('id').primaryKey().defaultRandom(),
    userId: uuid('userId').references(() => user.id).notNull(),
    blockedId: uuid('blockedId').references(() => user.id).notNull() 
})

export const archive = pgTable('archive', {
    id:uuid('id').primaryKey().defaultRandom(),
    userId:uuid('userId').references(()=> user.id),
    archiveId: uuid('archiveId').references(()=>user.id)
})

export const friend = pgTable('friend', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('userId').references(()=>user.id),
    freindId: uuid('friendId').references(()=> user.id)
})