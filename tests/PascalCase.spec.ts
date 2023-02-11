import { Blockchain } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { PascalCase } from '../wrappers/PascalCase';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('PascalCase', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('PascalCase');
    });

    it('should deploy', async () => {
        const blockchain = await Blockchain.create();

        const pascalCase = blockchain.openContract(PascalCase.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await pascalCase.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: pascalCase.address,
            deploy: true,
        });
    });
});
