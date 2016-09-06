#!/usr/bin/env node
'use strict';
const AccountManager = require('cyfin-account-lib');
const vorpal = require('vorpal')();
const WARN = '!!!Warning - make sure to note the mnemonic. It will be lost after restart of the CLI!'
const NO_KEY = 'No key loaded. Use `genKey` or `loadKey` commands.';
const CTA_REG = 'You can register your key with following command: `reg some@mail.com`';
var account;

var claim = function(args, callback) {

}

vorpal
  .command('info', 'Shows current key and registration status.')
  .alias('i')
  .action(function(args, callback){
    this.log('');
    if (!account) {
      this.log('No key loaded. Use `gen` or `load` commands.');
      this.log('');
      callback();
      return;
    }
    var key = account.getKey();
    this.log('key: ' + key.address);
    this.log('');
    var self = this;
    account.info().then(function(rsp) {
      account.id = rsp.id.split('-')[0];
      self.log('CyFin-Id: ' + account.id);
      self.log('balance: ' + parseFloat(rsp.balance));
      self.log('email: ' + rsp.email + '\n');
      callback();  
    }, function(err) {
      if (err.status === 401)
        self.log('Key not registered. \n' + CTA_REG);
      else 
        self.log(err);
      self.log('');
      callback();
    });
  });

vorpal
  .command('load', 'Loads account key from mnemonic.')
  .alias('l')
  .action(function(args, callback){
    if (account && account.getKey()) {
      this.log('');
      this.log('Key loading not possible. Key ' + account.getKey().address + ' already loaded.\nRestart the CLI if you want to use another key.');
      this.log('');
      callback();
      return;
    }
    var self = this;
    this.log('\nPlease enter a mnemonic or hex string to load your key:');
    this.prompt([{
        type: 'password',
        name: 'mnemonic',
        message: 'mnemonic/hex: '
    }], function(args) {
      account = new AccountManager(args.mnemonic);
      self.log('key: ' + account.getKey().address + '\nKey loaded successfully.\n');
      callback();
    });
  });

vorpal
  .command('generate', 'Generates a new mnemonic and derives key.')
  .alias('gen', 'g')
  .action(function(args, callback){
    this.log('');
    if (account && account.getKey()) {
      this.log('Key generation not possible. Key ' + account.getKey().address + ' already loaded.\nRestart the CLI if you want to use another key.');
      this.log('');
      callback();
      return;
    }
    
    account = new AccountManager();
    var key = account.createKey(), self = this;
    this.log(WARN + '\n\nYour mnemonic is:');
    vorpal.ui.redraw('\n  ' + key.secretSeed + '\n');
    this.prompt([{
        type: 'input',
        name: 'key',
        message: 'confirm to remove from screen: '
    }], function(args) {
      vorpal.ui.redraw.clear();
      vorpal.ui.redraw.done();
      self.log(' ***** ***** ******* ***** ******* **** ******* ****** ****** ****** ******* *****\n\n');
      self.log('key: ' + key.address + '\n\n' + CTA_REG);
      self.log('');
      callback();
    });
  });

vorpal
  .command('register <email>', 'Registers your key. After registration, your key can use payed APIs. A verification email will be sent to the address you provide.')
  .alias('reg', 'r')
  .action(function(args, callback){
    this.log('');
    if (!account || !account.getKey()) {
      this.log('Account registration failed. ' + NO_KEY);
      this.log('');
      callback();
      return;
    } else {
      var key = account.getKey();
      this.log('key: ' + key.address + '\n');
    }
    var self = this;
    account.register(args.email).then(function(rsp) {
      self.log('Email verification requested. A crypto-fulfillment will be sent to you. Please enter the fulfillment here by typing:\n\nconfirm cf:0:...');
      self.log('');
      callback();  
    }, function(err) {
      self.log(err);
      self.log('');
      callback();
    });
  });

vorpal
  .command('confirm <fulfillment>', 'Confirms a pending email by returning the received crypto-fulfillment.')
  .alias('conf', 'c')
  .action(function(args, callback){
    this.log('');
    if (!account || !account.getKey()) {
      this.log('Email confirmation failed. ' + NO_KEY);
      this.log('');
      callback();
      return;
    } else {
      var key = account.getKey();
      this.log('key: ' + key.address + '\n');
    }
    var self = this;
    account.confirm(args.fulfillment).then(function(rsp) {
      account.id = rsp.id.split('-')[0];
      self.log('CyFin-Id: ' + account.id);
      self.log('balance: ' + parseFloat(rsp.balance));
      self.log('email: ' + rsp.email + '\n\n');
      self.log('');
      callback();  
    }, function(err) {
      self.log(err);
      self.log('');
      callback();
    });
  });

vorpal
  .command('claim <fulfillment>', 'Charges the account with a voucher. The voucher is a crypto-fulfillment, received by email after purchase in the store.')
  .action(function(args, callback){
    this.log('');
    if (!account || !account.getKey()) {
      this.log('Claim failed. ' + NO_KEY);
      this.log('');
      callback();
      return;
    } else {
      var key = account.getKey();
      if (account.id)
        this.log('CyFin-Id: ' + account.id);
      this.log('key: ' + key.address + '\n');
    }
    var self = this;
    account.claim(args.fulfillment).then(function(rsp) {
      this.log('');
      self.log('Voucher claimed succesfully:');
      self.log(rsp);
      self.log('');
      callback();  
    }, function(err) {
      self.log(err);
      self.log('');
      callback();
    });
  });

vorpal
  .delimiter('CyFin$')
  .show()
  .log(' _____        ______  _            _        ')
  .log('/  __ \\       |  ___|(_)          (_)       ')
  .log('| /  \\/ _   _ | |_    _  _ __      _   ___  ')
  .log('| |    | | | ||  _|  | || \'_ \\    | | / _ \\ ')
  .log('| \\__/\\| |_| || |    | || | | | _ | || (_) |')
  .log(' \\____/ \\__, |\\_|    |_||_| |_|(_)|_| \\___/ ')
  .log('         __/ |                              ')
  .log('        |___/       Banking for the IoT     ')
  .log('')
  .log('type `help`, if you like ;)')
  .log('');