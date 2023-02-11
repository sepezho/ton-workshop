import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type PascalCaseConfig = {};

export function pascalCaseConfigToCell(config: PascalCaseConfig): Cell {
    return beginCell().endCell();
}

export class PascalCase implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new PascalCase(address);
    }

    static createFromConfig(config: PascalCaseConfig, code: Cell, workchain = 0) {
        const data = pascalCaseConfigToCell(config);
        const init = { code, data };
        return new PascalCase(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATLY,
            body: beginCell().endCell(),
        });
    }
}
