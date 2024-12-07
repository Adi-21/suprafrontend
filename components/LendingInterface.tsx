// "use client";

// import { useState, useEffect } from 'react';
// import { SupraAccount } from 'supra-l1-sdk';
// import SupraLendingClient from '@/lib/supra-client';

// interface PoolInfo {
//   totalUsdtDeposits: bigint;
//   totalUsdtBorrowed: bigint;
//   totalDogeCollateral: bigint;
// }

// interface UserInfo {
//   lender?: {
//     usdtDeposited: bigint;
//     currentInterest: bigint;
//     earnedInterest: bigint;
//   };
//   borrower?: {
//     dogeCollateral: bigint;
//     usdtBorrowed: bigint;
//     accruedInterest: bigint;
//     totalOwed: bigint;
//     timeElapsed: bigint;
//   };
// }

// export default function LendingInterface() {
//   const [account, setAccount] = useState<SupraAccount | null>(null);
//   const [depositAmount, setDepositAmount] = useState('');
//   const [withdrawAmount, setWithdrawAmount] = useState('');
//   const [borrowAmount, setBorrowAmount] = useState('');
//   const [repayAmount, setRepayAmount] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [poolInfo, setPoolInfo] = useState<PoolInfo | null>(null);
//   const [userInfo, setUserInfo] = useState<UserInfo>({});
//   const [loadingStates, setLoadingStates] = useState({
//     deposit: false,
//     withdraw: false,
//     borrow: false,
//     repay: false
//   });

//   useEffect(() => {
//     if (account) {
//       refreshUserInfo();
//       refreshPoolInfo();
//     }
//   }, [account]);

//   async function refreshUserInfo() {
//     if (!account) return;
    
//     try {
//       const client = await SupraLendingClient.getInstance();
//       const [lenderInfo, borrowerInfo] = await Promise.all([
//         client.getLenderInfo(account.address()),
//         client.getBorrowerInfo(account.address())
//       ]);
      
//       setUserInfo({ lender: lenderInfo, borrower: borrowerInfo });
//     } catch (error) {
//       console.error('Failed to fetch user info:', error);
//     }
//   }

//   async function refreshPoolInfo() {
//     try {
//       const client = await SupraLendingClient.getInstance();
//       const info = await client.getPoolInfo();
//       setPoolInfo(info);
//     } catch (error) {
//       console.error('Failed to fetch pool info:', error);
//     }
//   }

//   async function handleConnect() {
//     try {
//       const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
//       if (!privateKey) {
//         throw new Error("Private key not found");
//       }
//       const cleanPrivateKey = privateKey.replace('0x', '');
//       const privateKeyBuffer = Buffer.from(cleanPrivateKey, 'hex');
//       const account = new SupraAccount(privateKeyBuffer);
      
//       const client = await SupraLendingClient.getInstance();
//       if (!await client.checkAccountExists(account)) {
//         throw new Error("Account does not exist on chain. Please fund it first.");
//       }
      
//       setAccount(account);
//       console.log("Connected with address:", account.address().toString());
//     } catch (error) {
//       console.error('Failed to connect wallet:', error);
//     }
//   }

// // When creating a new account or handling addresses:
// async function handleDeposit() {
//   try {
//       if (!account) return;
      
//       // Ensure address is properly formatted
//       const formattedAddress = account.address().toString();
      
//       // Verify address length
//       if (formattedAddress.length !== 66) { // 64 chars + '0x' prefix
//           throw new Error("Invalid address format");
//       }

//       const client = await SupraLendingClient.getInstance();
//       await client.deposit(account, BigInt(depositAmount));
//   } catch (error) {
//       console.error("Deposit error details:", error);
//   }
// }

//   async function handleWithdraw() {
//     if (!account || !withdrawAmount) return;
//     try {
//       setLoading(true);
//       const client = await SupraLendingClient.getInstance();
//       await client.withdraw(account, BigInt(withdrawAmount));
//       setWithdrawAmount('');
//       await refreshUserInfo();
//       await refreshPoolInfo();
//     } catch (error) {
//       console.error('Failed to withdraw:', error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleBorrow() {
//     if (!account || !borrowAmount) return;
//     try {
//       setLoading(true);
//       const client = await SupraLendingClient.getInstance();
//       await client.borrowUsdt(account, BigInt(borrowAmount));
//       setBorrowAmount('');
//       await refreshUserInfo();
//       await refreshPoolInfo();
//     } catch (error) {
//       console.error('Failed to borrow:', error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleRepay() {
//     if (!account || !repayAmount) return;
//     try {
//       setLoading(true);
//       const client = await SupraLendingClient.getInstance();
//       await client.repayLoan(account, BigInt(repayAmount));
//       setRepayAmount('');
//       await refreshUserInfo();
//       await refreshPoolInfo();
//     } catch (error) {
//       console.error('Failed to repay:', error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       {/* Connection Status */}
//       <div className="mb-8">
//         {!account ? (
//           <button
//             onClick={handleConnect}
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             Connect Wallet
//           </button>
//         ) : (
//           <div className="text-sm text-gray-600">
//             Connected: {account.address().toString()}
//           </div>
//         )}
//       </div>

//       {/* Pool Info */}
//       {poolInfo && (
//         <div className="mb-8 bg-gray-50 p-4 rounded-lg">
//           <h3 className="text-lg font-semibold mb-2">Pool Statistics</h3>
//           <div className="grid grid-cols-3 gap-4">
//             <div>
//               <p className="text-sm text-gray-500">Total Deposits</p>
//               <p className="font-medium">{poolInfo.totalUsdtDeposits.toString()} USDT</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Total Borrowed</p>
//               <p className="font-medium">{poolInfo.totalUsdtBorrowed.toString()} USDT</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Total Collateral</p>
//               <p className="font-medium">{poolInfo.totalDogeCollateral.toString()} DOGE</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Interface */}
//       <div className="grid grid-cols-2 gap-8">
//         {/* Lending Section */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-bold mb-4">Lending</h2>
          
//           {userInfo.lender && (
//             <div className="text-sm text-gray-600 mb-4">
//               <p>Deposited: {userInfo.lender.usdtDeposited.toString()} USDT</p>
//               <p>Earned Interest: {userInfo.lender.earnedInterest.toString()} USDT</p>
//             </div>
//           )}

//           <div className="space-y-4">
//             {/* Deposit Section */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Deposit Amount</label>
//               <input
//                 type="number"
//                 value={depositAmount}
//                 onChange={(e) => setDepositAmount(e.target.value)}
//                 className="mt-1 block w-full rounded border-gray-300 shadow-sm"
//                 placeholder="Enter deposit amount"
//               />
//               <button
//                 onClick={handleDeposit}
//                 disabled={loadingStates.deposit || !account}
//                 className="mt-2 w-full bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
//               >
//                 {loadingStates.deposit ? 'Processing...' : 'Deposit'}
//               </button>
//             </div>

//             {/* Withdraw Section */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Withdraw Amount</label>
//               <input
//                 type="number"
//                 value={withdrawAmount}
//                 onChange={(e) => setWithdrawAmount(e.target.value)}
//                 className="mt-1 block w-full rounded border-gray-300 shadow-sm"
//                 placeholder="Enter withdraw amount"
//               />
//               <button
//                 onClick={handleWithdraw}
//                 disabled={loading || !account}
//                 className="mt-2 w-full bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
//               >
//                 {loading ? 'Processing...' : 'Withdraw'}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Borrowing Section */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-bold mb-4">Borrowing</h2>
          
//           {userInfo.borrower && (
//             <div className="text-sm text-gray-600 mb-4">
//               <p>Collateral: {userInfo.borrower.dogeCollateral.toString()} DOGE</p>
//               <p>Borrowed: {userInfo.borrower.usdtBorrowed.toString()} USDT</p>
//               <p>Interest Owed: {userInfo.borrower.accruedInterest.toString()} USDT</p>
//               <p>Total Debt: {userInfo.borrower.totalOwed.toString()} USDT</p>
//             </div>
//           )}

//           <div className="space-y-4">
//             {/* Borrow Section */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Borrow Amount</label>
//               <input
//                 type="number"
//                 value={borrowAmount}
//                 onChange={(e) => setBorrowAmount(e.target.value)}
//                 className="mt-1 block w-full rounded border-gray-300 shadow-sm"
//                 placeholder="Enter borrow amount"
//               />
//               <button
//                 onClick={handleBorrow}
//                 disabled={loading || !account}
//                 className="mt-2 w-full bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
//               >
//                 {loading ? 'Processing...' : 'Borrow'}
//               </button>
//             </div>

//             {/* Repay Section */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Repay Amount</label>
//               <input
//                 type="number"
//                 value={repayAmount}
//                 onChange={(e) => setRepayAmount(e.target.value)}
//                 className="mt-1 block w-full rounded border-gray-300 shadow-sm"
//                 placeholder="Enter repay amount"
//               />
//               <button
//                 onClick={handleRepay}
//                 disabled={loading || !account}
//                 className="mt-2 w-full bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
//               >
//                 {loading ? 'Processing...' : 'Repay'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BCS } from "aptos";

// Contract address
const CONTRACT_ADDRESS = "0x1202bd0151993fd3556212f9f5178fc5239f933beca6389738a5b0872eeea4b1";

interface LenderInfo {
    usdtDeposited: number;
    earnedInterest: number;
    currentInterest: number;
}

interface BorrowerInfo {
    dogeCollateral: number;
    usdtBorrowed: number;
    interest: number;
    totalOwed: number;
    timeElapsed: number;
}

interface PoolInfo {
    totalDeposits: number;
    totalBorrowed: number;
    totalCollateral: number;
}

export default function LendingProtocolPage() {
    // Wallet states
    const [supraProvider, setSupraProvider] = useState<any>(null);
    const [isExtensionInstalled, setIsExtensionInstalled] = useState<boolean>(false);
    const [accounts, setAccounts] = useState<string[]>([]);
    const [balance, setBalance] = useState<string>("");
    
    // Loading states
    const [loading, setLoading] = useState<boolean>(false);
    const [initializingLender, setInitializingLender] = useState<boolean>(false);
    const [initializingBorrower, setInitializingBorrower] = useState<boolean>(false);
    
    // Form states
    const [depositAmount, setDepositAmount] = useState<string>("");
    const [withdrawAmount, setWithdrawAmount] = useState<string>("");
    const [collateralAmount, setCollateralAmount] = useState<string>("");
    const [borrowAmount, setBorrowAmount] = useState<string>("");
    const [repayAmount, setRepayAmount] = useState<string>("");
    
    // Info states
    const [lenderInfo, setLenderInfo] = useState<LenderInfo | null>(null);
    const [borrowerInfo, setBorrowerInfo] = useState<BorrowerInfo | null>(null);
    const [poolInfo, setPoolInfo] = useState<PoolInfo | null>(null);

    useEffect(() => {
        checkIsExtensionInstalled();
    }, []);

    const checkIsExtensionInstalled = () => {
        const intervalId = setInterval(() => {
            if ((window as any)?.starkey) {
                const provider = (window as any)?.starkey.supra;
                setSupraProvider(provider);
                clearInterval(intervalId);
                setIsExtensionInstalled(true);
                updateAccounts().then();
            }
        }, 500);

        setTimeout(() => clearInterval(intervalId), 5000);
    };

    const updateAccounts = async () => {
        if (supraProvider) {
            try {
                const response_acc = await supraProvider.account();
                if (response_acc.length > 0) {
                    setAccounts(response_acc);
                    await updateBalance();
                    await fetchUserInfo(response_acc[0]);
                }
            } catch (e) {
                setAccounts([]);
            }
        }
    };

    const updateBalance = async () => {
        if (supraProvider && accounts.length) {
            const balance = await supraProvider.balance();
            if (balance) {
                setBalance(`${balance.formattedBalance} ${balance.displayUnit}`);
            }
        }
    };

    const connectWallet = async () => {
        setLoading(true);
        try {
            await supraProvider.connect();
            await updateAccounts();
        } catch (error) {
            console.error("Connection error:", error);
        }
        setLoading(false);
    };

    const createRawTransaction = (functionName: string, args: any[] = []) => {
        return [
            accounts[0],
            0,
            CONTRACT_ADDRESS,
            "lending_protocol",
            functionName,
            [],
            args,
            {
                txExpiryTime: (Math.ceil(Date.now() / 1000) + 30)
            }
        ];
    };

    const initializeLender = async () => {
        setInitializingLender(true);
        try {
            const rawTxPayload = createRawTransaction("initialize_lender");
            const data = await supraProvider.createRawTransactionData(rawTxPayload);
            const networkData = await supraProvider.getChainId();
            const params = {
                data,
                from: accounts[0],
                to: CONTRACT_ADDRESS,
                chainId: networkData.chainId,
                value: "",
            };
            await supraProvider.sendTransaction(params);
            await fetchUserInfo(accounts[0]);
        } catch (error) {
            console.error("Initialize lender error:", error);
        }
        setInitializingLender(false);
    };

    const initializeBorrower = async () => {
        setInitializingBorrower(true);
        try {
            const rawTxPayload = createRawTransaction("initialize_borrower");
            const data = await supraProvider.createRawTransactionData(rawTxPayload);
            const networkData = await supraProvider.getChainId();
            const params = {
                data,
                from: accounts[0],
                to: CONTRACT_ADDRESS,
                chainId: networkData.chainId,
                value: "",
            };
            await supraProvider.sendTransaction(params);
            await fetchUserInfo(accounts[0]);
        } catch (error) {
            console.error("Initialize borrower error:", error);
        }
        setInitializingBorrower(false);
    };

    const depositUsdt = async () => {
        try {
            const amount = Number(depositAmount);
            const optionalTransactionPayloadArgs = {
                txExpiryTime: (Math.ceil(Date.now() / 1000) + 30)
            }
            const rawTxPayload =  [
                accounts[0],
                0,
                CONTRACT_ADDRESS,
                "lending_protocol",
                "deposit_usdt",
                [],
                [BCS.bcsSerializeUint64(amount)],
                optionalTransactionPayloadArgs
            ];
            console.log("raw tran: ", rawTxPayload);
            const data = await supraProvider.createRawTransactionData(rawTxPayload);
            const networkData = await supraProvider.getChainId();
            const params = {
                data: data,
                from: accounts[0],
                to: CONTRACT_ADDRESS,
                chainId: networkData.chainId,
                value: "",
            };
            const tx = await supraProvider.sendTransaction(params);
            console.log("tx hash :", tx);
            await fetchUserInfo(accounts[0]);
            setDepositAmount("");
        } catch (error) {
            console.error("Deposit error:", error);
        }
    };

    const withdrawUsdt = async () => {
        try {
          const amount = Number(withdrawAmount);
            const optionalTransactionPayloadArgs = {
                txExpiryTime: (Math.ceil(Date.now() / 1000) + 30)
            }
            const rawTxPayload = [
                accounts[0],
                0,
                CONTRACT_ADDRESS,
                "lending_protocol",
                "withdraw_usdt",
                [],
                [BCS.bcsSerializeUint64(BigInt(amount))],
                optionalTransactionPayloadArgs
            ];
            const data = await supraProvider.createRawTransactionData(rawTxPayload);
            const networkData = await supraProvider.getChainId();
            const params = {
                data,
                from: accounts[0],
                to: CONTRACT_ADDRESS,
                chainId: networkData.chainId,
                value: "",
            };
            await supraProvider.sendTransaction(params);
            const tx = await supraProvider.sendTransaction(params);
            console.log("tx hash :", tx);
            await fetchUserInfo(accounts[0]);
            setWithdrawAmount("");
        } catch (error) {
            console.error("Withdraw error:", error);
        }
    };

    const depositCollateral = async () => {
        try {
            const amount = Number(collateralAmount);
            const optionalTransactionPayloadArgs = {
                txExpiryTime: (Math.ceil(Date.now() / 1000) + 30)
            }
            const rawTxPayload = [
                accounts[0],
                0,
                CONTRACT_ADDRESS,
                "lending_protocol",
                "deposit_collateral",
                [],
                [BCS.bcsSerializeUint64(BigInt(amount))],
                optionalTransactionPayloadArgs
            ];
            const data = await supraProvider.createRawTransactionData(rawTxPayload);
            const networkData = await supraProvider.getChainId();
            const params = {
                data,
                from: accounts[0],
                to: CONTRACT_ADDRESS,
                chainId: networkData.chainId,
                value: "",
            };
            await supraProvider.sendTransaction(params);
            await fetchUserInfo(accounts[0]);
            setCollateralAmount("");
        } catch (error) {
            console.error("Deposit collateral error:", error);
        }
    };

    const borrowUsdt = async () => {
        try {
            const amount = Number(borrowAmount);
            const optionalTransactionPayloadArgs = {
                txExpiryTime: (Math.ceil(Date.now() / 1000) + 30)
            }
            const rawTxPayload = [
                accounts[0],
                0,
                CONTRACT_ADDRESS,
                "lending_protocol",
                "borrow_usdt",
                [],
                [BCS.bcsSerializeUint64(BigInt(amount))],
                optionalTransactionPayloadArgs
            ];
            const data = await supraProvider.createRawTransactionData(rawTxPayload);
            const networkData = await supraProvider.getChainId();
            const params = {
                data,
                from: accounts[0],
                to: CONTRACT_ADDRESS,
                chainId: networkData.chainId,
                value: "",
            };
            await supraProvider.sendTransaction(params);
            await fetchUserInfo(accounts[0]);
            setBorrowAmount("");
        } catch (error) {
            console.error("Borrow error:", error);
        }
    };

    const repayLoan = async () => {
        try {
            const amount = Number(repayAmount);
            const optionalTransactionPayloadArgs = {
                txExpiryTime: (Math.ceil(Date.now() / 1000) + 30)
            }
            const rawTxPayload = [
                accounts[0],
                0,
                CONTRACT_ADDRESS,
                "lending_protocol",
                "repay_loan",
                [],
                [BCS.bcsSerializeUint64(BigInt(amount))],
                optionalTransactionPayloadArgs
            ];  
            const data = await supraProvider.createRawTransactionData(rawTxPayload);
            const networkData = await supraProvider.getChainId();
            const params = {
                data,
                from: accounts[0],
                to: CONTRACT_ADDRESS,
                chainId: networkData.chainId,
                value: "",
            };
            await supraProvider.sendTransaction(params);
            await fetchUserInfo(accounts[0]);
            setRepayAmount("");
        } catch (error) {
            console.error("Repay error:", error);
        }
    };

    const fetchUserInfo = async (address: string) => {
        try {
            // Implement view function calls here when available
            // For now, these will be placeholders
            setLenderInfo({
                usdtDeposited: 0,
                earnedInterest: 0,
                currentInterest: 0
            });
            setBorrowerInfo({
                dogeCollateral: 0,
                usdtBorrowed: 0,
                interest: 0,
                totalOwed: 0,
                timeElapsed: 0
            });
            setPoolInfo({
                totalDeposits: 0,
                totalBorrowed: 0,
                totalCollateral: 0
            });
        } catch (error) {
            console.error("Fetch user info error:", error);
        }
    };

    return (
        <main className="py-24 px-4 max-w-4xl mx-auto">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold mb-8">Supra Lending Protocol</h1>

                {!isExtensionInstalled && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Install StarKey Wallet</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Please install the StarKey wallet extension to continue.</p>
                        </CardContent>
                    </Card>
                )}

                {isExtensionInstalled && !accounts.length && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Connect Wallet</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={connectWallet} disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Connect Wallet
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {accounts.length > 0 && (
                    <>
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>Account Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-center gap-4">
                                    <Badge variant="outline">Address: {accounts[0]}</Badge>
                                    <Badge variant="outline">Balance: {balance}</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Lender Dashboard</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Button 
                                        onClick={initializeLender}
                                        disabled={initializingLender}
                                        className="w-full"
                                    >
                                        {initializingLender && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Initialize as Lender
                                    </Button>

                                    <div className="space-y-2">
                                        <Input
                                            type="number"
                                            placeholder="Amount to deposit"
                                            value={depositAmount}
                                            onChange={(e) => setDepositAmount(e.target.value)}
                                        />
                                        <Button 
                                            onClick={depositUsdt}
                                            className="w-full"
                                            disabled={!depositAmount}
                                        >
                                            Deposit USDT
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <Input
                                            type="number"
                                            placeholder="Amount to withdraw"
                                            value={withdrawAmount}
                                            onChange={(e) => setWithdrawAmount(e.target.value)}
                                        />
                                        <Button 
                                            onClick={withdrawUsdt}
                                            className="w-full"
                                            disabled={!withdrawAmount}
                                        >
                                            Withdraw USDT
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Borrower Dashboard</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Button 
                                        onClick={initializeBorrower}
                                        disabled={initializingBorrower}
                                        className="w-full"
                                    >
                                        {initializingBorrower && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Initialize as Borrower
                                    </Button>

                                    <div className="space-y-2">
                                        <Input
                                            type="number"
                                            placeholder="Collateral amount"
                                            value={collateralAmount}
                                            onChange={(e) => setCollateralAmount(e.target.value)}
                                        />
                                        <Button 
                                            onClick={depositCollateral}
                                            className="w-full"
                                            disabled={!collateralAmount}
                                        >
                                            Deposit Collateral
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <Input
                                            type="number"
                                            placeholder="Amount to borrow"
                                            value={borrowAmount}
                                            onChange={(e) => setBorrowAmount(e.target.value)}
                                        />
                                        <Button 
                                            onClick={borrowUsdt}
                                            className="w-full"
                                            disabled={!borrowAmount}
                                        >
                                            Borrow USDT
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <Input
                                            type="number"
                                            placeholder="Amount to repay"
                                            value={repayAmount}
                                            onChange={(e) => setRepayAmount(e.target.value)}
                                        />
                                        <Button 
                                            onClick={repayLoan}
                                            className="w-full"
                                            disabled={!repayAmount}
                                        >
                                            Repay Loan
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Lender Info</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {lenderInfo && (
                                        <div className="space-y-2">
                                            <p>Deposited: {lenderInfo.usdtDeposited} USDT</p>
                                            <p>Earned Interest: {lenderInfo.earnedInterest} USDT</p>
                                            <p>Current Interest: {lenderInfo.currentInterest} USDT</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Borrower Info</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {borrowerInfo && (
                                        <div className="space-y-2">
                                            <p>Collateral: {borrowerInfo.dogeCollateral} DOGE</p>
                                            <p>Borrowed: {borrowerInfo.usdtBorrowed} USDT</p>
                                            <p>Interest: {borrowerInfo.interest} USDT</p>
                                            <p>Total Owed: {borrowerInfo.totalOwed} USDT</p>
                                            <p>Time Elapsed: {Math.floor(borrowerInfo.timeElapsed / 60)} minutes</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Pool Info</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {poolInfo && (
                                        <div className="space-y-2">
                                            <p>Total Deposits: {poolInfo.totalDeposits} USDT</p>
                                            <p>Total Borrowed: {poolInfo.totalBorrowed} USDT</p>
                                            <p>Total Collateral: {poolInfo.totalCollateral} DOGE</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}