```
                 _               _       
                (_)             (_)      
    ___ ___  ___ _  __ _ _ __    _  ___  
   / __/ _ \/ __| |/ _` | '_ \  | |/ _ \
  | (_| (_) \__ \ | (_| | | | |_| | (_) |
   \___\___/|___/_|\__, |_| |_(_)_|\___/ 
                    __/ |
   An open, secure |___/ identity platform.

type `help`, if you like ;)

cosign$

```
# Installation

you should get a print like above on your terminal with the following steps:
```
npm install cosign-cli
cosign
```

After installing cosign-cli, continue to:
- [generate and register a key](#generate-and-register-a-key)
- purchase a voucher from the [shop](https://holvi.com/shop/ocolin/)
- [claim the voucher](#generate-and-register-a-key)

# Generate and Register a Key

To create a working setup, you need to execute the following steps:

1. generate a key
2. register the key
3. read the key balance


## Generating a Key

Install the cosign-cli as described here. then run this `generate` command:
```bash
cosign$ generate
```

A secret seed will be generated and displayed as mnemonic. Example:
```
Your mnemonic is:

 ***** ***** ******* ***** ******* **** ******* ****** ****** ****** ******* *****

confirm to remove from screen:
```
Make sure to note the mnemonic. The mnemonic will be removed from the terminal history after you press a key and will be lost after restart of the CLI.

## Register Key

Now that you have generated a key in the previous step, continue to register it with this command:
```bash
cosign$ register your@email.com

Email verification requested. A crypto-fulfillment will be sent to you.
```

You will receive an email similar to this one:
```
Dear customer, 

We have received a request to authorize this email address for Cosign.io. If you requested this verification, please return the following crypto fulfillment: 

cf:0:RoFF18igQ7msaEjUKU21zw
```

Note the line starting with **cf:0:**. This is a crypto-fulfillment. Return it to the CLI by tiping:
```bash
cosign$ confirm cf:0:RoFF18igQ7msaEjUKU21zw
```

To verify that setup was successful, type:
```bash
cosign$ info
```

You should receive status information of your registered key:
```
cosign-id: 0092a8ff
balance: 0.0
email: your@email.com
```

You can top-up your balance by [claiming a voucher](#claim-a-voucher).

# Claim-a-Voucher

To top-up the balance of a key, purchase a voucher at [the shop](https://holvi.com/shop/ocolin/).

After the purchase, you will receive and email with a crypto-fulfillment, similar to this:
```
cf:37:eyJpcPI4-v.Z_x4-gc3
```

To claim the voucher you need to:

1. install and start cosign-cli.
2. load your key in the cosign-cli. 
3. claim the crypto-fulfillment.

If you haven't installed the CLI yet, follow [these instructions](#instalation).

If you haven't generated and registered a key yet, please execute [these steps](#generate-and-register-a-key) first.

Once you are able to display key status information, including a balance, please proceed.

## Claiming a Crypto-Fulfillment

use the following command to claim:
```bash
cosign$ claim cf:37:eyJpcPI4-v.Z_x4-gc3
```

A successful claim will result in an email sent to your account and your balance updated:
```
cosign-id: 0092a8ff
balance: 20.0
email: your@email.com
```