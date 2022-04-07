import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { ethers } from 'ethers';
import styles from '../styles/Home.module.css'
import ToolTip from './components/ToolTip';
import ABI from '../artifacts/contracts/NFT.sol/NFT.json';
import { TransactionResponse } from '@ethersproject/abstract-provider';

enum Network {
  MAIN_NETWORK = 1,
  ROPSTEN_TESTNET = 3,
  RINKEBY_TESTNET = 4,
  GOERLI_TESTNET = 5,
  KOVAN_TESTNET = 42
}

const CONTRACT_ADDRESS = '0x7B0A16A6Df9Ee6609c4633c4AD869B10dED0bF6c';

const Home: NextPage = () => {
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [signer, setSigner] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);

  const onClose = () => { setMessage(""); }

  const checkIfMetamaskInstalled = () => {
    return typeof window.ethereum !== 'undefined';
  }

  // we will deploy on Rinkeby
  const switchNetwork = async () => {
    if (checkIfMetamaskInstalled() && window.ethereum.networkVersion !== Network.RINKEBY_TESTNET) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x4' }],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x4',
                  chainName: 'Rinkeby',
                  rpcUrls: ['https://ropsten.infura.io/v3/'] /* ... */,
                },
              ],
            });
          } catch (addError: any) {
            throw new Error(addError?.message || 'addChain Error')
          }
        }
        throw new Error(switchError?.message || 'switchChain Error')
      }
    }
  }

  const checkPre = useCallback(() => {
    if (!checkIfMetamaskInstalled()) {
      setMessage("Metamask is not installed");
      return false;
    }
    return true;
  }, []);

  const connect = async () => {
    if (checkPre() && !pending) {
      setPending(true);
      try {
        await switchNetwork();
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAddress(account);
        setPending(false);
      } catch (e: any) {
        setMessage(e?.message || 'request error');
        setPending(false);
      }
    }
  }

  const mint = async () => {
    if (!address) {
      setMessage("Please connect your wallet first");
      return
    }
    if (!signer || !contract) {
      setMessage("Please check your rpc connect status")
      return
    }
    if (!loading) {
      setLoading(true);
      setMessage("");
      try {
        const sender = await signer.getAddress();
        const txn: TransactionResponse = await contract.mint(sender, 1);
        await txn.wait();
        setLoading(false);
      } catch (e: any) {
        setMessage(e?.message || 'request error');
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (checkPre()) {
      const abi = ABI.abi;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      setSigner(signer);
      setContract(contract);
    }
  }, [checkPre]);

  useEffect(() => {
    if (signer && contract) {
      contract.on('Transfer', (from: any, to: any, tokenId: any) => {
        setMessage(`${tokenId} sucessfully minted from ${from} to ${to}`);
      });
    }

    return () => { contract?.off('Transfer', () => {}) }
  }, [contract, signer])

  return (
    <div className={styles.container}>
      <Head>
        <title>Voxel Owl</title>
        <meta name="description" content="Voxel Owl NFT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {message && <ToolTip message={message} onClose={onClose} />}

      <main className={styles.main}>
        <section className={styles.btn} onClick={connect}>
          {address || "Connect Wallet"}
        </section>
        <section className={styles.desc}>
          The Voxel Owl is a 86 NFT drop lives on Ethereum Blockchain!!!
        </section>
        <section className={styles.btn} onClick={mint}>
          {loading ? "Loading..." : "Mint"}
        </section>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://testnets.opensea.io/collection/voxelowl-v4"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Collection On{' '}
          <span className={styles.logo}>
            <Image src="/opensea.svg" alt="Opensea Logo" width={32} height={32} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
