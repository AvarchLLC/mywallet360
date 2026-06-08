import { useCallback, useEffect, useRef, useState } from 'react'
import { walletService } from '../services/walletService'
import { resolveWalletIdentifier } from '../utils/resolveWalletIdentifier'

export function useWalletDashboard() {
  const [wallet, setWallet] = useState(null)
  const [searchValue, setSearchValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResolving, setIsResolving] = useState(false)
  const [resolvedIdentifier, setResolvedIdentifier] = useState(null)
  const [error, setError] = useState('')
  const [connectedAddress, setConnectedAddress] = useState('')
  const [connectedProvider, setConnectedProvider] = useState(null)
  const [walletProviders, setWalletProviders] = useState([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState('')
  const isLoadingRef = useRef(false)

  const analyzeWallet = useCallback(async (identifier) => {
    if (isLoadingRef.current) return

    isLoadingRef.current = true
    setIsResolving(true)
    setError('')

    try {
      const resolution = await resolveWalletIdentifier(identifier)
      setResolvedIdentifier(resolution)
      setIsResolving(false)
      setIsLoading(true)

      const nextWallet = await walletService.getWalletByAddress(resolution.address)
      setWallet(nextWallet)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      isLoadingRef.current = false
      setIsResolving(false)
      setIsLoading(false)
    }
  }, [])

  const searchWallet = () => analyzeWallet(searchValue)
  const updateSearchValue = (value) => {
    setSearchValue(value)
    setError('')
    setResolvedIdentifier(null)
  }
  const selectExampleWallet = (address) => {
    setSearchValue(address)
    analyzeWallet(address)
  }

  useEffect(() => {
    const addProvider = (provider, info = {}) => {
      if (!provider) return

      setWalletProviders((currentProviders) => {
        if (currentProviders.some((item) => item.provider === provider)) return currentProviders

        return [...currentProviders, {
          provider,
          name: info.name || (provider.isMetaMask ? 'MetaMask' : 'Browser Wallet'),
          icon: info.icon || '',
          rdns: info.rdns || '',
        }]
      })
    }

    const handleProviderAnnouncement = (event) => {
      addProvider(event.detail.provider, event.detail.info)
    }

    window.addEventListener('eip6963:announceProvider', handleProviderAnnouncement)
    window.dispatchEvent(new Event('eip6963:requestProvider'))

    const injectedProviders = window.ethereum?.providers || (window.ethereum ? [window.ethereum] : [])
    injectedProviders.forEach((provider) => addProvider(provider))

    return () => window.removeEventListener('eip6963:announceProvider', handleProviderAnnouncement)
  }, [])

  useEffect(() => {
    if (!connectedProvider?.on) return undefined

    const handleAccountsChanged = (accounts) => {
      const nextAddress = accounts[0] || ''
      setConnectedAddress(nextAddress)

      if (nextAddress) {
        setSearchValue(nextAddress)
        analyzeWallet(nextAddress)
      } else {
        setConnectedProvider(null)
      }
    }

    connectedProvider.on('accountsChanged', handleAccountsChanged)
    return () => connectedProvider.removeListener?.('accountsChanged', handleAccountsChanged)
  }, [analyzeWallet, connectedProvider])

  const connectWallet = async (walletProvider) => {
    setIsConnecting(true)
    setConnectionError('')

    try {
      const provider = walletProvider.provider

      try {
        await provider.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        })
      } catch (permissionError) {
        const isUnsupported = permissionError.code === -32601 || permissionError.code === 4200

        if (!isUnsupported) throw permissionError
      }

      const accounts = await provider.request({ method: 'eth_requestAccounts' })
      const address = accounts[0]

      if (!address) throw new Error('No wallet account was selected.')

      setConnectedProvider(provider)
      setConnectedAddress(address)
      setSearchValue(address)
      await analyzeWallet(address)
    } catch (requestError) {
      let message = requestError.message || 'Unable to connect wallet.'

      if (requestError.code === 4001) {
        message = 'Connection permission was rejected.'
      } else if (requestError.code === -32002) {
        message = 'A wallet permission request is already open. Check your wallet extension.'
      }

      setConnectionError(message)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setConnectedAddress('')
    setConnectedProvider(null)
    setConnectionError('')
  }

  return {
    error,
    wallet,
    searchValue,
    isLoading,
    isResolving,
    resolvedIdentifier,
    setSearchValue: updateSearchValue,
    searchWallet,
    selectExampleWallet,
    connectedAddress,
    walletProviders,
    isConnecting,
    connectionError,
    connectWallet,
    disconnectWallet,
  }
}
