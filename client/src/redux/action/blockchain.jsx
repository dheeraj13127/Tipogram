import {FETCH_OWNER_ACCOUNT,LOAD_TIPOGRAM_CONTRACT} from '../constants/constants'
import toast from "react-hot-toast";

export const loadTipogramContract = payload => async (dispatch) => {
    dispatch({
      type: LOAD_TIPOGRAM_CONTRACT,
      payload: payload
    })
  }


  export const loadOwnerAccount = payload => async (dispatch) => {
    dispatch({
      type: FETCH_OWNER_ACCOUNT,
      payload: payload
    })
  }

  export const connectWallet = (setErrorMessage,setDefaultAccount,setUserBalance,ethers) => async (dispatch) => {
    
		if (window.ethereum && window.ethereum.isMetaMask) {
			

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
			
				getAccountBalance(result[0]);
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
            toast("Please install Metamask",{
                icon:"❗️"
              })
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	

		

	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		getAccountBalance(newAccount.toString());
	}

	const getAccountBalance = (account) => {
		window.ethereum.request({method: 'eth_getBalance', params: [account, 'latest']})
		.then(balance => {
			setUserBalance(ethers.utils.formatEther(balance));
		})
		.catch(error => {
			setErrorMessage(error.message);
		});
	};

	const chainChangedHandler = () => {

		window.location.reload();
	}



	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);
  }



//  const networks = {
// 	polygon: {
// 	  chainId:`0x${Number(137).toString(16)}`,
// 	  chainName: "Mumbai Testnet",
// 	  nativeCurrency: {
// 		name: "MATIC",
// 		symbol: "MATIC",
// 		decimals: 18
// 	  },
// 	  rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
// 	  blockExplorerUrls: ["https://polygonscan.com/"]
// 	}
// }

//   export const connectToWallet = () => async (dispatch) => {
// 		try{
// 			if (!window.ethereum) throw new Error("No crypto wallet found");
// 			await window.ethereum.request({
// 			  method: "wallet_addEthereumChain",
// 			  params: [
// 				{
// 				  ...networks["polygon"]
// 				}
// 			  ]
// 			});
// 		}
// 		catch (err) {
// 			console.log(err.message);
// 		  }
//   }