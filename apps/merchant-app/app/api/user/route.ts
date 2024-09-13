// import prisma from "@repo/db/client";
import { NextResponse } from "next/server";

export const GET = async () => {
//   await prisma.user.create({
//     data: {
//       number: "111111111111111111111",
//       password: "password",
//     },
//   });
  return NextResponse.json({
    message: "hi there",
  });
};
