// declare module 'supra-l1-sdk' {
//   export class HexString {
//     constructor(hexString: string | Uint8Array);
//     toString(): string;
//     toUint8Array(): Uint8Array;
//   }

//   export class SupraAccount {
//     constructor(privateKey: Buffer);
//     address(): HexString;
//     pubKey(): string;
//   }

//   export class SupraClient {
//     static init(rpcUrl: string): Promise<SupraClient>;
//     getAccountInfo(address: HexString): Promise<any>;
//     isAccountExists(address: HexString): Promise<boolean>;
//     submitTransaction(tx: any, options: any): Promise<any>;
//     view(moduleAddress: string, moduleName: string, functionName: string, args: any[]): Promise<any>;
//     createRawTxObject(senderAddr: HexString, senderSequenceNumber: bigint, moduleAddr: HexString, moduleName: string, functionName: string, functionTypeArgs: any[], functionArgs: any[]): Promise<RawTxnJSON>;
//     createSignedTransaction(senderAccount: SupraAccount, rawTxn: RawTxnJSON): SignedTransaction;
//   }

//   export interface EntryFunctionPayloadJSON {
//     function: string;
//     type_arguments: string[];
//     arguments: any[];
//   }

//   export interface RawTxnJSON {
//     chain_id: number;
//     expiration_timestamp_secs: number;
//     gas_unit_price: number;
//     max_gas_amount: number;
//     payload: EntryFunctionPayloadJSON;
//     sender: string;
//     sequence_number: number;
//   }

//   export interface SignedTransaction {
//     raw_txn: RawTxnJSON;
//     authenticator: any;
//   }

//   export class BCS {
//     static bcsSerializeUint64(value: bigint): Uint8Array;
//   }
// } 