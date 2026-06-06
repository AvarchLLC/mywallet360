import { defaultWalletId, getMockWallet, mockWallets } from '../mockWallets'

export const walletService = {
  getDefaultWalletId: () => defaultWalletId,
  getWallet: getMockWallet,
  getWalletSnapshot: (walletId) => mockWallets[walletId],
  listDemoWallets: () => Object.values(mockWallets),
}
