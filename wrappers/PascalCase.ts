import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type PascalCaseConfig = {
    value: number;
};

export function pascalCaseConfigToCell(config: PascalCaseConfig): Cell {
    return beginCell().storeUint(config.value, 64).endCell();
}

export class PascalCase implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new PascalCase(address);
    }

    static createFromConfig(config: PascalCaseConfig, code: Cell, workchain = 0) {
        const data = beginCell().storeUint(config.value, 64).endCell();
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

    async getData(provider: ContractProvider): Promise<PascalCaseConfig> {
        const { stack } = await provider.get('get_number', []);
        return {
            value: stack.readNumber(),
        };
    }

    async sendIncrease(provider: ContractProvider, via: Sender, msg_value: bigint, increase_value: number) {
        const in_msg_body = beginCell().storeUint(1, 32).storeUint(0, 64).storeUint(increase_value, 64).endCell();

        await provider.internal(via, {
            value: msg_value,
            sendMode: SendMode.PAY_GAS_SEPARATLY,
            body: in_msg_body,
        });
    }
}
