import { apiFetch } from '../utils/api.js'

const API_BASE_URL = import.meta.env.VITE_API_URL || ''
export const ANALYSIS_PERIODS = [
  { days: 1, label: 'Last day', shortLabel: '1D', description: 'Today’s activity' },
  { days: 7, label: 'Last week', shortLabel: '7D', description: 'Recent activity' },
  { days: 30, label: 'Last 30 days', shortLabel: '30D', description: 'Monthly overview' },
  { days: 365, label: 'Last year', shortLabel: '1Y', description: 'Long-term activity' },
]
const DEFAULT_AVATAR = 'cebc058af93e566c96200932c258f395cbf87ebd.png'
const EXAMPLE_WALLETS = [
  {
    name: 'Active wallet sample',
    type: 'Public Ethereum address',
    description: 'A useful example for exploring everyday wallet activity and on-chain behavior.',
    address: '0xbf03a2440bf80f7726ba5f60f0ac260ccad82a0b',
  },
  {
    name: 'Public wallet sample',
    type: 'Well-known address',
    description: 'A public address with a rich transaction history for exploring wallet analytics.',
    address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
  },
  {
    name: 'High-activity sample',
    type: 'Frequent transactions',
    description: 'A useful example for seeing how a wallet with frequent transfers is summarized.',
    address: '0x28c6c06298d514db089934071355e5743bf21d60',
  },
]

const compactAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`

const formatUsd = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
  notation: Number(value) >= 1_000_000 ? 'compact' : 'standard',
}).format(Number(value || 0))

const formatNumber = (value, maximumFractionDigits = 4) => new Intl.NumberFormat('en-US', {
  maximumFractionDigits,
}).format(Number(value || 0))

const explanation = (title, summary, formula, details = []) => ({ title, summary, formula, details })

const formatRelativeTime = (timestamp) => {
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000))

  if (elapsedSeconds < 60) return 'Just now'
  if (elapsedSeconds < 3600) return `${Math.floor(elapsedSeconds / 60)} minutes ago`
  if (elapsedSeconds < 86400) return `${Math.floor(elapsedSeconds / 3600)} hours ago`

  return `${Math.floor(elapsedSeconds / 86400)} days ago`
}

const personalityConfig = {
  nftCollector: { label: 'NFT Collector', icon: '99_918.svg', tone: 'primary' },
  trader: { label: 'Trader', icon: '99_917.svg', tone: 'blue' },
  defiExplorer: { label: 'DeFi Explorer', icon: '99_938.svg', tone: 'green' },
  holder: { label: 'Holder', icon: '99_959.svg', tone: 'green' },
}

const transactionConfig = (type = '') => {
  const normalizedType = type.toLowerCase()

  if (normalizedType.includes('receive')) {
    return { tone: 'green', icon: '99_875.svg', positive: true }
  }

  if (normalizedType.includes('swap') || normalizedType.includes('trade')) {
    return { tone: 'blue', icon: '99_917.svg', positive: false }
  }

  if (normalizedType.includes('nft')) {
    return { tone: 'mint', icon: '99_896.svg', positive: false }
  }

  return { tone: 'mint', icon: '99_938.svg', positive: false }
}

function buildTransactions(timeline) {
  return timeline.map((item) => {
    const config = transactionConfig(item.type)
    const title = item.type.replace(/\b\w/g, (character) => character.toUpperCase())
    const amount = item.value ? `${config.positive ? '+' : '-'}${formatNumber(item.value.amount)}` : 'Contract'
    const crypto = item.value?.symbol || compactAddress(item.hash)

    return {
      displayTitle: title,
      title: item.hash,
      meta: formatRelativeTime(item.timestamp),
      amount,
      crypto,
      protocol: compactAddress(item.hash),
      protocolMark: title[0] || 'T',
      chain: 'Ethereum',
      explanation: explanation(
        `${title} transaction`,
        'This activity type is inferred from transaction direction, input data, and recognized swap selectors.',
        'Receive: wallet is recipient · Swap: recognized swap selector · Otherwise: send or contract interaction',
        [`Transaction hash: ${item.hash}`, `From: ${item.from || 'Unknown'}`, `To: ${item.to || 'Contract creation'}`],
      ),
      ...config,
    }
  })
}

function buildWallet(address, analytics) {
  const periodLabel = ANALYSIS_PERIODS.find((period) => period.days === analytics.period.days)?.label
    || `Last ${analytics.period.days} days`
  const factors = analytics.personalityFactors || {}
  const personalityExplanations = {
    nftCollector: explanation(
      'Why NFT Collector?',
      'NFT activity receives two points for every NFT transfer found in the selected period.',
      'NFT Collector score = NFT transfers × 2',
      [`${formatNumber(factors.nftTransfers, 0)} NFT transfers contributed to this score.`],
    ),
    trader: explanation(
      'Why Trader?',
      'Trading behavior combines recognized swap calls with outgoing token transfers.',
      'Trader score = swaps × 3 + outgoing token transfers',
      [`${formatNumber(factors.swapCount, 0)} swaps and ${formatNumber(factors.outgoingTransfers, 0)} outgoing token transfers were found.`],
    ),
    defiExplorer: explanation(
      'Why DeFi Explorer?',
      'Interactions with recognized Aave, Compound, and 1inch contracts increase this score.',
      'DeFi Explorer score = recognized DeFi interactions × 3',
      [`${formatNumber(factors.defiInteractions, 0)} recognized DeFi interactions were found.`],
    ),
    holder: explanation(
      'Why Holder?',
      'Holding behavior grows when incoming transfers exceed outgoing transfers and when the wallet currently owns more assets.',
      'Holder score = max(0, incoming − outgoing) + current assets',
      [`${formatNumber(factors.incomingTransfers, 0)} incoming transfers, ${formatNumber(factors.outgoingTransfers, 0)} outgoing transfers, and ${formatNumber(factors.currentAssetCount, 0)} current assets were used.`],
    ),
  }
  const personalityTraits = Object.entries(analytics.personality)
    .map(([key, value]) => ({ ...personalityConfig[key], value, explanation: personalityExplanations[key] }))
    .sort((first, second) => second.value - first.value)
  const primaryPersonality = personalityTraits[0]
  const flowTotal = analytics.moneyFlow.received + analytics.moneyFlow.spent
  const receivedPercent = flowTotal ? Math.round((analytics.moneyFlow.received / flowTotal) * 100) : 0
  const spentPercent = flowTotal ? 100 - receivedPercent : 0
  const activityLevel = analytics.transactionCount > 500 ? 'Very High' : analytics.transactionCount > 100 ? 'High' : 'Moderate'
  const portfolioScore = Math.min(99, Math.round(50 + Math.log10(analytics.netWorth + 1) * 12))
  const largestHolding = analytics.largestHolding

  return {
    id: address.toLowerCase(),
    analysisDays: analytics.period.days,
    chipLabel: compactAddress(address),
    profile: {
      name: 'Wallet Analytics',
      wallet: compactAddress(address),
      avatar: DEFAULT_AVATAR,
    },
    balance: {
      value: formatUsd(analytics.netWorth),
      valuationLabel: analytics.valuation?.source === 'alchemy'
        ? `Alchemy priced assets${analytics.valuation.complete === false ? ' (partial)' : ''}`
        : 'Estimated priced assets',
      growth: periodLabel,
      rank: `${analytics.transactionCount.toLocaleString()} txns`,
      explanation: explanation(
        'How priced assets are calculated',
        'This is the sum of current token balances that have a USD price from the active valuation provider.',
        'Priced assets = Σ(token balance × USD token price)',
        [
          `${analytics.valuation?.pricedAssetCount || 0} of ${analytics.valuation?.totalAssetCount || 0} discovered assets had prices.`,
          `Source: ${analytics.valuation?.source === 'alchemy' ? 'Alchemy portfolio prices' : 'Etherscan-based fallback estimate'}.`,
          analytics.valuation?.complete === false ? 'The provider result hit the page cap, so this value is partial.' : 'Provider pagination completed.',
        ],
      ),
      stats: [
        { label: 'Transactions', value: analytics.transactionCount.toLocaleString(), icon: 'rank', explanation: explanation('Transactions analyzed', `Successful and failed normal transactions returned during ${periodLabel.toLowerCase()}.`, 'Count of normal transactions in selected period') },
        { label: 'Activity', value: activityLevel, icon: 'activity', explanation: explanation('Activity level', 'A simple label based on transaction count in the selected period.', 'Very High: >500 · High: >100 · Moderate: ≤100', [`This wallet has ${analytics.transactionCount.toLocaleString()} transactions.`]) },
        { label: 'NFTs', value: analytics.nftCount.toLocaleString(), icon: 'risk', explanation: explanation('Current NFT holdings', 'NFT transfers are replayed to estimate how many NFT items the wallet currently holds.', 'Current NFTs = received NFT items − sent NFT items') },
        { label: 'Network', value: 'Ethereum', icon: 'network', explanation: explanation('Analyzed network', 'Activity analytics currently use Ethereum mainnet Etherscan data.', 'Chain ID = 1') },
      ],
    },
    portfolio: {
      status: analytics.netWorth > 0 ? 'Active' : 'Empty',
      score: portfolioScore,
      scoreExplanation: explanation('Portfolio Score', 'A presentation score based on the logarithm of currently priced asset value.', 'min(99, round(50 + log10(priced assets + 1) × 12))', [`Current score: ${portfolioScore}/100.`]),
      metrics: [
        {
          label: 'Largest Holding',
          value: largestHolding?.symbol || 'None',
          detail: largestHolding ? formatUsd(largestHolding.usdValue) : 'No priced holdings',
          icon: 'wallet',
          primary: true,
          explanation: explanation('Largest priced holding', 'The priced asset with the highest calculated USD value.', 'Largest holding = max(balance × USD price)', [`It represents ${largestHolding?.percentage || 0}% of all currently priced assets.`]),
        },
        { label: 'NFT Count', value: analytics.nftCount.toLocaleString(), detail: 'Items collected', icon: 'nft', explanation: explanation('NFT Count', 'Estimated current NFT items after replaying NFT transfers.', 'Received items − sent items') },
        { label: 'Received', value: `${formatNumber(analytics.moneyFlow.received)} ETH`, detail: `${analytics.moneyFlow.incomingCount} transfers`, icon: 'defi', explanation: explanation('ETH received', `ETH transferred into this wallet during ${periodLabel.toLowerCase()}.`, 'Sum of successful incoming normal and internal transfer values') },
        { label: 'Spent', value: `${formatNumber(analytics.moneyFlow.spent)} ETH`, detail: `${analytics.moneyFlow.outgoingCount} transfers`, icon: 'collection', explanation: explanation('ETH spent', `ETH transferred out of this wallet during ${periodLabel.toLowerCase()}.`, 'Sum of successful outgoing normal and internal transfer values') },
      ],
    },
    identity: [
      { label: 'Portfolio Score', value: `${portfolioScore}/100`, description: 'Based on wallet value and activity', icon: 'portfolio', tone: 'gold', explanation: explanation('Portfolio Score', 'A presentation score derived from currently priced asset value.', 'min(99, round(50 + log10(priced assets + 1) × 12))') },
      { label: 'Transactions', value: analytics.transactionCount.toLocaleString(), description: `Activity during ${periodLabel.toLowerCase()}`, icon: 'risk', tone: 'blue', explanation: explanation('Transaction Count', `Normal Ethereum transactions returned during ${periodLabel.toLowerCase()}.`, 'Count of normal transactions in the selected window') },
      { label: 'NFT Holdings', value: analytics.nftCount.toLocaleString(), description: 'Current NFT collection size', icon: 'age', tone: 'purple', explanation: explanation('NFT Holdings', 'Estimated current NFT items from transfer history.', 'Received NFT items − sent NFT items') },
      { label: 'Data Source', value: analytics.valuation?.source === 'alchemy' ? 'Alchemy + Etherscan' : 'Etherscan', description: `${periodLabel} of activity with current priced assets`, icon: 'kyc', tone: 'green', explanation: explanation('Data Sources', 'Etherscan supplies activity. Alchemy supplies current token balances and prices when configured.', 'Activity: Etherscan · Valuation: Alchemy or fallback') },
    ],
    personality: {
      title: primaryPersonality?.label || 'New Wallet',
      description: `This wallet is primarily shaped by ${primaryPersonality?.label.toLowerCase() || 'limited on-chain activity'}.`,
      traits: personalityTraits,
      explanation: explanation('Wallet Personality', 'Raw behavior scores are normalized into percentages. The highest percentage becomes the primary trait.', 'Trait percentage = raw trait score ÷ total raw scores × 100'),
    },
    ai: {
      summary: `${compactAddress(address)} has ${analytics.transactionCount.toLocaleString()} transactions and ${formatUsd(analytics.netWorth)} in currently priced assets.`,
      confidence: `Based on activity from ${periodLabel.toLowerCase()}`,
      insights: [
        { text: `${activityLevel} wallet activity.`, detail: `${analytics.transactionCount.toLocaleString()} transactions`, icon: 'network', tone: 'blue', explanation: explanation('Activity insight', 'Activity level is assigned from transaction count in the selected period.', 'Very High: >500 · High: >100 · Moderate: ≤100') },
        { text: `${analytics.nftCount.toLocaleString()} NFTs currently held.`, detail: 'Collection activity', icon: 'risk', tone: 'green', explanation: explanation('NFT insight', 'Current NFT holdings are estimated by replaying NFT transfers.', 'Received NFT items − sent NFT items') },
        { text: `${primaryPersonality?.label || 'No dominant behavior'} is the primary trait.`, detail: `${primaryPersonality?.value || 0}% score`, icon: 'growth', tone: 'teal', explanation: primaryPersonality?.explanation },
      ],
    },
    flow: {
      periodLabel,
      received: { value: `+${formatNumber(analytics.moneyFlow.received)} ETH`, percent: receivedPercent, explanation: explanation('Money Received', `Successful ETH transfers received during ${periodLabel.toLowerCase()}.`, 'Received share = received ETH ÷ (received ETH + spent ETH) × 100') },
      spent: { value: `-${formatNumber(analytics.moneyFlow.spent)} ETH`, percent: spentPercent, explanation: explanation('Money Spent', `Successful ETH transfers sent during ${periodLabel.toLowerCase()}.`, 'Spent share = spent ETH ÷ (received ETH + spent ETH) × 100') },
      categories: [
        { label: 'Incoming', value: `${analytics.moneyFlow.incomingCount} txns`, percent: receivedPercent, tone: 'mint', icon: '99_740.svg', explanation: explanation('Incoming transfers', 'Successful ETH-bearing normal and internal transfers sent to this wallet.', 'Incoming count = matching successful receive transfers') },
        { label: 'Outgoing', value: `${analytics.moneyFlow.outgoingCount} txns`, percent: spentPercent, tone: 'red', icon: '99_756.svg', explanation: explanation('Outgoing transfers', 'Successful ETH-bearing normal and internal transfers sent by this wallet.', 'Outgoing count = matching successful send transfers') },
      ],
    },
    transactions: buildTransactions(analytics.timeline),
    highlights: [
      { label: 'Largest Holding', value: largestHolding?.symbol || 'None', detail: `${largestHolding?.percentage || 0}%`, icon: 'holding', tone: 'violet', explanation: explanation('Largest Holding', 'The asset with the highest available USD value.', 'max(balance × USD price)') },
      { label: 'Money Received', value: `${formatNumber(analytics.moneyFlow.received)} ETH`, detail: `${analytics.moneyFlow.incomingCount} transfers`, icon: 'protocol', tone: 'pink', explanation: explanation('Money Received', `Total incoming ETH during ${periodLabel.toLowerCase()}.`, 'Sum of successful incoming ETH values') },
      { label: 'Money Spent', value: `${formatNumber(analytics.moneyFlow.spent)} ETH`, detail: `${analytics.moneyFlow.outgoingCount} transfers`, icon: 'chain', tone: 'blue', explanation: explanation('Money Spent', `Total outgoing ETH during ${periodLabel.toLowerCase()}.`, 'Sum of successful outgoing ETH values') },
      { label: 'Transactions', value: analytics.transactionCount.toLocaleString(), detail: periodLabel.toLowerCase(), icon: 'transactions', tone: 'green', explanation: explanation('Transactions', `Normal transactions found during ${periodLabel.toLowerCase()}.`, 'Count of normal Etherscan transaction records') },
    ],
    insights: [
      { label: 'Priced Assets', value: formatNumber(analytics.netWorth, 2), suffix: 'USD', explanation: explanation('Priced Assets', 'Current balances with an available USD price.', 'Σ(balance × USD price)') },
      { label: 'Largest Holding', value: largestHolding?.percentage || 0, suffix: '%', explanation: explanation('Largest Holding Concentration', 'How much of the priced portfolio is represented by its largest asset.', 'Largest asset USD value ÷ total priced assets × 100') },
    ],
  }
}

async function getWalletByAddress(address, days = 30) {
  const normalizedAddress = address.trim()

  if (!/^0x[a-fA-F0-9]{40}$/.test(normalizedAddress)) {
    throw new Error('Enter a valid Ethereum wallet address.')
  }

  const response = await apiFetch(`${API_BASE_URL}/api/wallet/${normalizedAddress}?days=${days}`)
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'Unable to fetch wallet analytics.')
  }

  if (data?.period?.days !== days) {
    throw new Error('The API returned stale period data. Restart or deploy the latest backend.')
  }

  return buildWallet(normalizedAddress, data)
}

export const walletService = {
  getWalletByAddress,
  listExampleWallets: () => EXAMPLE_WALLETS,
}
