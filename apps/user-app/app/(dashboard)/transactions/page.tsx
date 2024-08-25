import { Transactions } from "../../../components/Transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";

async function getOnRampTransactions() {
    const session = await getServerSession(authOptions);
    const txnsRamp = await prisma.onRampTransaction.findMany({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    const txnsP2p = await prisma.p2pTransfer.findMany({
        where: {
            fromUserId: Number(session?.user?.id)
        }
    });
    const  txtramp =  txnsRamp.map((t:any) => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }))
    const txtp2p =  txnsP2p.map((t:any) => ({
        time: t.timestamp,
        amount: t.amount,
        fromUserId: t.fromUserId,
        toUserId : t.toUserId
    }))

    console.log("txt",txtp2p)

    const combinedTransactions = [...txtramp, ...txtp2p];
    console.log(combinedTransactions)
    return combinedTransactions;

}


export default async function() {
    const transactions = await getOnRampTransactions();
    console.log(transactions)
    return  <div>
        <Transactions transactions={transactions}></Transactions>
</div>
}