import { toNano } from 'ton-core';
import { PascalCase } from '../wrappers/PascalCase';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const pascalCase = PascalCase.createFromConfig({}, await compile('PascalCase'));

    await provider.deploy(pascalCase, toNano('0.05'));

    const openedContract = provider.open(pascalCase);

    // run methods on `openedContract`
}
