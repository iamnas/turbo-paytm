"use server"

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";


export async function  createOnRampTransaction(amount: number,provider: string){
    
    const sesstion = await getServerSession(authOptions);

    const userId = sesstion.user.id;

    const token = crypto.randomUUID() // (Math.random() * 1000).toString();

    if(!userId){
        return{
            message:"User not logged in"
        }
    }


    await prisma.onRampTransaction.create({
        data:{
            userId: Number(userId),
            amount:amount,
            provider:provider,
            status:"Processing",
            startTime:new Date(),
            token:token
        }
    })

    return {
        message:"On ramp Done"
    }

}