import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/textInput";
import { useState } from "react";
import { SendMoney } from "../../../components/SendMoney";
import { getServerSession } from "next-auth";
import { Onp2pTransaction } from "../../../components/Onp2pTransaction";
import prisma from "@repo/db/client";
import { authOptions } from "../../lib/auth";
import { Sen } from "next/font/google";


async function getOnp2pTransaction() {
    const session = await getServerSession(authOptions);
    console.log("session: " , session);
    const txns = await prisma.p2pTransfer.findMany({
        where: {
            fromUserId: Number(session?.user?.id)
        }
    });
    return txns.map((t) => ({
        time: t.timestamp,
        amount: t.amount,
        fromUserId: t.fromUserId,
        toUserId : t.toUserId
    }))
}
export default async function (){

  const transactions = await getOnp2pTransaction();
  console.log('transactions: ', transactions)
    return (
        <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            P2P
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <div>
                <SendMoney />
            </div>
            <div>

                <div className="pt-4">
                    <Onp2pTransaction transactions={transactions} />
                </div>
            </div>
        </div>
    </div>
    )
}