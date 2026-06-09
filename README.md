# MyWallet360

A responsive React dashboard for a crypto wallet identity and portfolio overview.

## Development

```bash
npm install
npm --prefix backend install
npm run dev
```

In a second terminal:

```bash
npm --prefix backend run dev
```

Copy `.env.example` and `backend/.env.example` to local `.env` files and set
the required provider credentials. Never commit secrets.

Rotate provider credentials immediately if an `.env` file is ever shared,
logged, or exposed outside the machine that runs the service.

## Production

Required backend variables:

- `NODE_ENV=production`
- `ETHERSCAN_API_KEY`
- `FRONTEND_URL` containing the allowed frontend origin or comma-separated origins

Optional integrations and tuning are documented in `backend/.env.example`.

Before deploying, run:

```bash
npm run check
```

Deploy the Vite `dist` directory as the frontend and run the backend with:

```bash
npm --prefix backend start
```

The frontend defaults to same-origin `/api` requests. Set `VITE_API_URL` only
when the API is hosted on a different origin.

## Local Preview

```bash
npm run build
npm run preview
```

Wallet search accepts Ethereum addresses and ENS `.eth` names. ENS names are
resolved before the existing wallet analytics request runs.
