"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export const p2pTransfer = async (to: string, amount: number) => {
  const sesstion = await getServerSession(authOptions);

//   console.log(sesstion);
  
  const from = sesstion?.user?.id;

  
  if (!from) {
    return {
      message: "Error while sending",
    };
  }

  const toUser = await prisma.user.findUnique({
    where: {
      number: to,
    },
  });

  if (!toUser) {
    return {
      message: "User not found",
    };
  }

  await prisma.$transaction(async (tx) => {
    
    await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;
    
    const fromBalance = await tx.balance.findUnique({
      where: { userId: Number(from) },
    });

    if (!fromBalance || fromBalance.amount < amount) {
      throw new Error("Insufficient funds");
    }

    await tx.balance.update({
      where: { userId: Number(from) },
      data: { amount: { decrement: amount } },
    });

    await tx.balance.update({
      where: { userId: Number(toUser.id) },
      data: { amount: { increment: amount } },
    });

    await tx.p2pTransfer.create({
        data:{
            amount:amount,
            fromUserId:Number(from),
            toUserId:toUser.id
        }
    })
  });
};
