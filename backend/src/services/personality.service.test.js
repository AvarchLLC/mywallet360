import assert from "node:assert/strict";
import test from "node:test";
import { calculatePersonalityDetails } from "./personality.service.js";

test("returns the evidence used to calculate wallet personality", () => {
  const result = calculatePersonalityDetails({
    normalTransactions: [
      { isError: "0", input: "0x38ed1739" },
      { isError: "0", input: "0x" },
    ],
    tokenTransfers: [
      { direction: "receive" },
      { direction: "receive" },
      { direction: "send" },
    ],
    nftTransfers: [{}, {}],
    protocolCounts: { Aave: 1, Compound: 0, "1inch": 1 },
    currentAssetCount: 4,
  });

  assert.deepEqual(result.factors, {
    nftTransfers: 2,
    swapCount: 1,
    outgoingTransfers: 1,
    defiInteractions: 2,
    incomingTransfers: 2,
    currentAssetCount: 4,
  });
  assert.deepEqual(result.rawScores, {
    nftCollector: 4,
    trader: 4,
    defiExplorer: 6,
    holder: 5,
  });
  assert.equal(Object.values(result.percentages).reduce((sum, value) => sum + value, 0), 100);
});
