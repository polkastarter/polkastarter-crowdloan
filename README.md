Setting Up the Environment
===
1. Setup up Polkadot with Polkadot Launch

We used the following documentation to set up our Polkadot Rococo testing environment:
https://github.com/paritytech/polkadot-launch

The config.json we used is the following:
```
{
 "relaychain": {
  "bin": "../crowdloans/binaries/polkadot",
  "chain": "rococo-local",
  "nodes": [
   {
    "name": "alice",
    "wsPort": 9944,
    "port": 30444
   },
   {
    "name": "bob",
    "wsPort": 9955,
    "port": 30555
   },
   {
    "name": "charlie",
    "wsPort": 9966,
    "port": 30666
   },
   {
    "name": "dave",
    "wsPort": 9977,
    "port": 30777
   }
  ]
 },
 "parachains": [
  ],
  "simpleParachains": [],
 "hrmpChannels": [
  {
   "sender": 200,
   "recipient": 300,
   "maxCapacity": 8,
   "maxMessageSize": 512
  }
 ],
 "types": {},
 "finalization": false
}
```

2. Configure a Test Crowdloan

https://app.element.io/#/room/#rococo-faucet:matrix.org

How to use
===

1. Install deps

`yarn install` or `npm install`

2. Run the DApp

`yarn start`

3. Visit the campaign page. Currently the following crowdloan campaigns exist:

- http://localhost:3000/campaigns/1000
- http://localhost:3000/campaigns/1001
- http://localhost:3000/campaigns/1002
- http://localhost:3000/campaigns/1003
- http://localhost:3000/campaigns/1004
