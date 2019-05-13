# Charlie: The block explorer upgrader

## Problem: Block explorers aren't made for answering customer support tickets

- In order to do basic stuff like search amounts, you have to add commas and remove trailing zeroes from your CTRL-F query.

- Addresses are hyperlinked and hard to copy.

- In order to load important information needed to answer tickets, you often need to open up a full transaction display window.

- There's no batch searching (we solved this with https://app.txbatch.com, by the way) or searching via amount/address/memo.

So...

## Solution: Charlie

- An open-source Chrome extension that upgrades block explorers, by removing unnecessary 'features' and adding genuine missing features.

## Benefits

### Remove commas automatically when searching numbers

Before:

![](https://i.imgur.com/JlXD154.png)

After:

![](https://i.imgur.com/VXDcxJM.png)

### Stop accidentally clicking on address/transaction links

Before:

![](https://i.imgur.com/SPPhu62.png)

After:

![](https://i.imgur.com/oN51w87.png)

Example with Etherscan:

![](https://i.imgur.com/HA6Tx3C.png)

After:

![](https://i.imgur.com/TRclUuP.png)

### Get matches for trailing zeroes (sats) when you search amounts

Before:

![](https://i.imgur.com/HooVByr.png)

After:

![](https://i.imgur.com/ZacK10v.png)
