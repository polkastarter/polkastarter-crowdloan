# Setup & Testing Guide

### Running an instance of Rococo Locally


We used the following documentation to set up our Polkadot Rococo testing environment:
https://github.com/paritytech/polkadot-launch

The config.json file we used was the following:

```jsx
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

Finally, start the relay chain along with the parachains

```jsx
polkadot-launch config.json
```

Now you have a running instance of a local Rococo runtime.

One simple an effective way to start interacting with the runtime is by using the Polkadot.js App which is essentially a generic DApp which you can use to quickly view any Polkadot runtime.

```jsx
git clone git@github.com:polkadot-js/apps.git
cd apps
yarn install
yarn start
```

Now if you open your browser at [http://localhost:3000](http://localhost:3000) you should see the chain explorer

By default the DApp will be connected to one of the mainnet networks. However, in our case we would like to interact with the local network we just launched. To do so we would need to click on the top right corner and change the rpc node to the local instance.


Polkadot launch started three validator instances; one of those instances is running an RPC endpoint at ws://127.0.0.1:9944

Now click on the switch button and you'll be connected to the local network.


We will first need to register the Parachain with the Registar module. This is a simple extrinsic which we can send via the Apps UI. Select Developer > Extrinsics from the menu and select registar from the dropdown.

Use the following value for the genesis_head and validator_code:

0x0061736d01000000cd6d45e38e62e341984996592474b685b080e7aae796363f

Finally you can start interacting with the crowdloan module via the generic extrinsic UI. Select crowloan module from the dropdown.

We have built a separate DApp that is purely for the purpose of the purpose of interacting with the crowdloan module. However, we can still use the above UI to create a new campaign. 

Fill out the above form with some values (check the meaning of each property in the section above) and click Submit Transaction.

[]()

Click Sign and Submit and the signed transaction will be submitted to the relay chain. The result of the transaction is a new campaign created and registered. 

Now let's switch to Alice's account and make contribution to this fund.


Again click Submit Transaction and then Sign and Send.

We can check the status of a fund by sending a query. Select Developer > Chain State. Select crowdloan and funds from the two drop downs and enter 0, which is the index of the fund we created (fund index is a monotonic value that increments every time a new fund is created)

### Running the DApp

We demonstrated how one can create, contribute and query the fund data using the generic PolkadotJS DApp. However, we have built a custom DApp which is much simpler and it let's users directly interact with a fund. It also allows anyone to create a new fund.

To make any interactions with the DApp, the polkadot browser extension will have to be installed on the users machine and follow the steps to create a new account.

One can download it from [https://polkadot.js.org/extension/](https://polkadot.js.org/extension/)

In addition to that, we would need to fund the wallet we just created with some DOT so we can interact with the relay chain. Luckily as we saw earlier, the local network we launched does have some test account with some funds. We can use the PolkadotJS DApp to transfer some amount to the newly created account.

Select accounts form the menu and click the send button next to Alice name.

Then copy the address of the account by clicking on the browser extention we just installed.

Finally enter the amount you want to send from Alice's account to the new account and click make transfer. 

Ok now that the new account has got some fund, let's clone the DApp 

https://github.com/polkastarter/polkastarter-crowdloan

Install the dependencies and run the DApp

```jsx
yarn install
yarn start
```

Now visit [http://localhost:3000](https://localhost:3000)  (Or the other suggested port if there was a port conflict)

The DApp allows users to to contribute to the crowdloan.

Click on Crowdloans and replace the paraId parameter on the URL with the same one you created back on the chain explorer

Contribute any value and you should see a success message

## References

1. [https://github.com/paritytech/polkadot-launch](https://github.com/paritytech/polkadot-launch)
2. [https://github.com/paritytech/cumulus](https://github.com/paritytech/cumulus)
3. [https://polkadot.js.org/apps/](https://polkadot.js.org/apps/)
4. [https://github.com/polkadot-js/apps](https://github.com/polkadot-js/apps)
5. [https://polkadot.js.org/api](https://polkadot.js.org/docs/api/)
6. [https://github.com/polkadot-js/api](https://github.com/polkadot-js/api)
7. [https://polkadot.js.org/extension/](https://polkadot.js.org/extension/)
