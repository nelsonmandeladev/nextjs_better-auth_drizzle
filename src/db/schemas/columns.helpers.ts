import {timestamp, uuid} from "drizzle-orm/pg-core";

export const baseColumns = {
    id: uuid().primaryKey().defaultRandom(),
    updated_at: timestamp(),
    created_at: timestamp().defaultNow().notNull(),
    deleted_at: timestamp(),
}