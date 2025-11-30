import { z } from "zod";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentInsertSchema } from "../schemas";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const [existingAgent] = await db
                .select()
                .from(agents)
                .where(
                    and(
                        eq(agents.id, input.id),
                        eq(agents.userId, ctx.auth.user.id),
                    ),
                );

            if (!existingAgent) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
            }

            return existingAgent;
        }),
    getMany: protectedProcedure.query(async ({ ctx }) => {
        const data = await db
            .select()
            .from(agents)
            .where(eq(agents.userId, ctx.auth.user.id));

        return data;
    }),
    create: protectedProcedure
        .input(agentInsertSchema)
        .mutation(async ({ input, ctx }) => {
            const [createdAgent] = await db
                .insert(agents)
                .values({
                    ...input,
                    userId: ctx.auth.user.id,
                })
                .returning();

            return createdAgent;
        }),
    update: protectedProcedure
        .input(
            agentInsertSchema.extend({
                id: z.string(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const [updatedAgent] = await db
                .update(agents)
                .set({
                    name: input.name,
                    instructions: input.instructions,
                    updatedAt: new Date(),
                })
                .where(
                    and(
                        eq(agents.id, input.id),
                        eq(agents.userId, ctx.auth.user.id),
                    ),
                )
                .returning();

            if (!updatedAgent) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
            }

            return updatedAgent;
        }),
});
