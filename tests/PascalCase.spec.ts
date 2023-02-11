import { Blockchain, OpenedContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { PascalCase } from '../wrappers/PascalCase';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('PascalCase', () => {
    let code: Cell;

    let pascalCase: OpenedContract<PascalCase>;

    beforeAll(async () => {
        code = await compile('PascalCase');
    });

    beforeEach(async () => {
        const blockchain = await Blockchain.create();

        pascalCase = blockchain.openContract(
            PascalCase.createFromConfig(
                {
                    value: 42,
                },
                code
            )
        );
    });

    it('should deploy', async () => {
        const blockchain = await Blockchain.create();

        const pascalCase = blockchain.openContract(
            PascalCase.createFromConfig(
                {
                    value: 42,
                },
                code
            )
        );

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await pascalCase.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: pascalCase.address,
            deploy: true,
        });
    });

    it('should get default initial value from the storage', async () => {
        const blockchain = await Blockchain.create();

        const pascalCase = blockchain.openContract(
            PascalCase.createFromConfig(
                {
                    value: 42,
                },
                code
            )
        );

        const deployerWallet = await blockchain.treasury('deployer');

        const deployResult = await pascalCase.sendDeploy(deployerWallet.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployerWallet.address,
            to: pascalCase.address,
            deploy: true,
        });

        const data = await pascalCase.getData();

        expect(data.value).toEqual(42);

        const increaseResult = await pascalCase.sendIncrease(deployerWallet.getSender(), toNano('0.05'), 1);

        expect(increaseResult.transactions).toHaveTransaction({
            from: deployerWallet.address,
            to: pascalCase.address,
            value: toNano('0.05'),
            success: true,
        });

        const newData = await pascalCase.getData();

        expect(newData.value).toEqual(43);

        // console.log(increaseResult.transactions);
    });
});
