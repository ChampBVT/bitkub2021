const axios = require('axios');

const APIKEY = 'T84QBITJ6RDVA8Q7X77MR4MEJBTXV11W6Y';
const URL = 'https://api-ropsten.etherscan.io/api';
const address = '0xEcA19B1a87442b0c25801B809bf567A6ca87B1da';
const coin = 'BKTC';

let walletLists;
const walletSet = new Set([]);

const getAll = async (addr) => {
  let addrs = addr;
  if (!addr) addrs = address;
  const history = await axios.get(`${URL}?module=account&action=tokentx&address=${addrs}&startblock=0&endblock=999999999&sort=asc&apikey=${APIKEY}`);
  const filtered = history.data.result.filter((t) => (t.tokenSymbol === coin && t.from === addrs.toLowerCase()));
  const table = filtered.map((t) => ({
    value: t.value / 10 ** 18,
    hash: t.hash,
    from: t.from,
    to: t.to,
    tokenSymbol: t.tokenSymbol,
  }));
  const walletFrom = filtered.map((t) => (t.from));
  const walletTo = filtered.map((t) => (t.to));
  const walletMore = walletTo.concat(walletFrom);
  walletLists = [...walletMore];
  const temp = walletLists.shift();
  if (temp) walletSet.add(temp);
  if (walletLists.length > 0) getAll(temp);
  console.log('Address: ', addrs);
  console.table(table);
  if (walletLists.length === 0) return walletSet;
};

// getTransactionHistory().then();
getAll();
