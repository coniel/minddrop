import type { ElectrobunStub } from './createElectrobunStub';

/**
 * Registers a Bun runtime plugin resolving `electrobun/bun` to a stub.
 * Modules which import it then load outside the Electrobun runtime.
 *
 * Must be called before importing the modules which use the stub.
 *
 * @param stub - The stub module's exports.
 */
export function registerElectrobunStubPlugin(stub: ElectrobunStub): void {
  // Resolve `electrobun/bun` to the stub
  Bun.plugin({
    name: 'electrobun-stub',
    setup(build) {
      build.module('electrobun/bun', () => ({
        exports: { ...stub },
        loader: 'object',
      }));
    },
  });
}
