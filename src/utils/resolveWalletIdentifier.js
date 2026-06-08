const API_BASE_URL = import.meta.env?.VITE_API_URL || ''
const ETHEREUM_ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/
const UNSTOPPABLE_TLDS = new Set([
  '888',
  'anime',
  'binanceus',
  'bitcoin',
  'blockchain',
  'crypto',
  'dao',
  'go',
  'hi',
  'klever',
  'kresus',
  'manga',
  'nft',
  'polygon',
  'wallet',
  'x',
  'zil',
])

export const getWalletIdentifierType = (input) => {
  const normalizedInput = input.trim().toLowerCase()

  if (ETHEREUM_ADDRESS_PATTERN.test(normalizedInput)) return 'address'

  const tld = normalizedInput.split('.').pop()

  if (tld === 'eth') return 'ens'
  if (UNSTOPPABLE_TLDS.has(tld)) return 'unstoppable'

  return null
}

export const resolveWalletIdentifier = async (input) => {
  const originalInput = input.trim()
  const type = getWalletIdentifierType(originalInput)

  if (!originalInput || !type) {
    throw new Error('Enter a valid Ethereum address, ENS name, or Unstoppable Domain.')
  }

  if (type === 'address') {
    return {
      address: originalInput,
      type,
      originalInput,
    }
  }

  let response

  try {
    response = await fetch(`${API_BASE_URL}/api/resolve/${encodeURIComponent(originalInput)}`)
  } catch {
    throw new Error('Domain resolution is unavailable right now. Please try again.')
  }

  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(result.message || 'We could not resolve that domain. Check the name and try again.')
  }

  if (!ETHEREUM_ADDRESS_PATTERN.test(result.address)) {
    throw new Error('That domain does not have a valid Ethereum address.')
  }

  return {
    address: result.address,
    type,
    originalInput,
  }
}
