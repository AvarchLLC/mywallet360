# MyWallet360

A responsive React dashboard for a crypto wallet identity and portfolio overview.

## Development

```bash
npm install
npm run dev
```

## Production

```bash
npm run lint
npm run build
npm run preview
```

## Domain resolution

Wallet search accepts Ethereum addresses, ENS names, and Unstoppable Domains.
Configure the backend before resolving domains:

```bash
ETHEREUM_RPC_URL=https://ethereum-rpc.publicnode.com
UNSTOPPABLE_API_KEY=your_server_side_unstoppable_api_key
```
