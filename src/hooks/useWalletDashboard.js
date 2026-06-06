import { useState } from 'react'
import { walletService } from '../services/walletService'

const defaultWalletId = walletService.getDefaultWalletId()

export function useWalletDashboard() {
  const [selectedWalletId, setSelectedWalletId] = useState(defaultWalletId)
  const [wallet, setWallet] = useState(walletService.getWalletSnapshot(defaultWalletId))
  const [searchValue, setSearchValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const selectWallet = async (walletId) => {
    if (isLoading || walletId === selectedWalletId) return

    setIsLoading(true)
    setSearchValue(walletService.getWalletSnapshot(walletId).chipLabel)

    const nextWallet = await walletService.getWallet(walletId)

    setSelectedWalletId(walletId)
    setWallet(nextWallet)
    setIsLoading(false)
  }

  return {
    wallet,
    selectedWalletId,
    searchValue,
    isLoading,
    setSearchValue,
    selectWallet,
  }
}
