import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Quantum Mechanical Model Calculations', () => {
  test('Nodal surfaces formula: Total = n - 1, Radial = n - l - 1, Angular = l', () => {
    const calcNodes = (n: number, l: number) => ({
      radial: n - l - 1,
      angular: l,
      total: n - 1,
    });

    // 1s
    assert.deepEqual(calcNodes(1, 0), { radial: 0, angular: 0, total: 0 });
    // 2s
    assert.deepEqual(calcNodes(2, 0), { radial: 1, angular: 0, total: 1 });
    // 2p
    assert.deepEqual(calcNodes(2, 1), { radial: 0, angular: 1, total: 1 });
    // 3s
    assert.deepEqual(calcNodes(3, 0), { radial: 2, angular: 0, total: 2 });
    // 3p
    assert.deepEqual(calcNodes(3, 1), { radial: 1, angular: 1, total: 2 });
    // 3d
    assert.deepEqual(calcNodes(3, 2), { radial: 0, angular: 2, total: 2 });
    // 4f
    assert.deepEqual(calcNodes(4, 3), { radial: 0, angular: 3, total: 3 });
  });

  test('Shell capacities and orbital counts: 2n² and n²', () => {
    for (let n = 1; n <= 4; n++) {
      const orbitals = n * n;
      const maxElectrons = 2 * n * n;
      assert.equal(orbitals, n ** 2);
      assert.equal(maxElectrons, 2 * (n ** 2));
    }
  });

  test('Aufbau (n + l) Madelung rule correctly orders 4s before 3d', () => {
    const subshellEnergyVal = (n: number, l: number) => ({
      nPlusL: n + l,
      n,
    });

    const s4 = subshellEnergyVal(4, 0); // 4 + 0 = 4
    const d3 = subshellEnergyVal(3, 2); // 3 + 2 = 5

    assert.ok(s4.nPlusL < d3.nPlusL, '4s has lower (n + l) than 3d and thus fills first');
  });

  test('Degeneracy per subshell: 2l + 1', () => {
    const degeneracy = (l: number) => 2 * l + 1;
    assert.equal(degeneracy(0), 1); // s
    assert.equal(degeneracy(1), 3); // p (px, py, pz)
    assert.equal(degeneracy(2), 5); // d (dz2, dx2-y2, dxy, dxz, dyz)
    assert.equal(degeneracy(3), 7); // f
  });
});
