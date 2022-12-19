import { FETCH_OWNER_ACCOUNT, LOAD_TIPOGRAM_CONTRACT, UPLOAD_IMAGE, FETCH_TIPOGRAM_IMAGES, UPDATE_POSTS_LIKES, UPDATE_AUTHOR_LIKES } from '../constants/constants'
import toast from "react-hot-toast";
import axios from 'axios';
const web3_utils = require('web3-utils');

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

export const fetchTipogramImages = payload => async (dispatch) => {
	dispatch({
		type: FETCH_TIPOGRAM_IMAGES,
		payload: payload
	})
}

export const connectWallet = (setErrorMessage, setDefaultAccount, setUserBalance, ethers) => async (dispatch) => {

	if (window.ethereum && window.ethereum.isMetaMask) {
		// if(window.ethereum.networkVersion==="4"){
			window.ethereum.request({ method: 'eth_requestAccounts' })
			.then(result => {
			
			
				accountChangedHandler(result[0]);

				getAccountBalance(result[0]);
			})
			.catch(error => {
				setErrorMessage(error.message);
				console.log(error)
			});
		
	
		

	} else {
		toast("Please install Metamask", {
			icon: "❗️"
		})
		setErrorMessage('Please install MetaMask browser extension to interact');
	}




	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		getAccountBalance(newAccount.toString());

	}

	const getAccountBalance = (account) => {
		window.ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] })
			.then(balance => {
				setUserBalance(ethers.utils.formatEther(balance));
			})
			.catch(error => {
				setErrorMessage(error.message);
				toast.error(error.message);
			
			});
	};

	const chainChangedHandler = () => {

		window.location.reload();
	}



	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);
}





export const uploadImage = (data, tipogramContract, userData, metamaskAccount) => async (dispatch) => {
	toast("Will take few seconds", {
		icon: "⏳",
	});
	await tipogramContract.methods.uploadImage(data.imgUrl, data.title, userData.profileImage, userData.userName, data.imgType,userData._id).send({ from: metamaskAccount, gas: 1000000 })
		.then(async (res) => {
			let userNewData = {
				userId: userData._id,
				postId: res.events.ImageCreated.returnValues.id

			}
			await axios.post("https://tipogram-h94e.onrender.com/dashboard/updateImagesPosted", userNewData)
				.then(resp => {
					toast("Successfully posted", {
						icon: "🎉",

					})
					dispatch({
						type: UPLOAD_IMAGE,
						payload: res
					})
				})
				.catch(errs => {
					toast.error("Something went wrong")
				})

		})
		.catch(err => {
			
			toast.error("Transaction failed")
		})

}
export const updatePostLikes = (data, tipogramContract, metamaskAccount, userData,authorId) => async (dispatch) => {

	await tipogramContract.methods.likeImage(data).send({ from: metamaskAccount, gas: 0 })
		.then(async (res) => {
			const userNewData = {
				userId: userData._id,
				postId: data
			}
			await axios.post("https://tipogram-h94e.onrender.com/dashboard/updateUserLikedposts", userNewData)
				.then(async(resp) => {
					await axios.put(`https://tipogram-h94e.onrender.com/dashboard/updateAuthorLikes/${authorId}`)
					.then(response=>{
						toast(`You liked the post`, {
						})
						dispatch({
							type: UPDATE_POSTS_LIKES,
							payload: resp
						})
						window.location.reload(false);
					})
					.catch(err => {
						toast.error("Something went wrong")
					})

				
				})
				.catch(err => {
					toast.error("Something went wrong")
				})



		})
		.catch(err => {
			
			toast.error("Transaction failed")
		})

}

export const tipImages = (data, tipogramContract, metamaskAccount, tipAmt,authorId) => async (dispatch) => {
	const newTipAmt = web3_utils.toWei(tipAmt,"ether");
	
	await tipogramContract.methods.tipImage(data).send({ from: metamaskAccount, value: newTipAmt, gas: 1000000 })
		.then(async (res) => {
			let newData={
				authorId:authorId,
				tipAmt:tipAmt,
			}
			await axios.post("https://tipogram-h94e.onrender.com/dashboard/updateTipsReceived", newData)
			.then(resp=>{
				
				toast("Thank you for the tip", {
					icon: "😊",
	
				})
				setTimeout(()=>{
					window.location.href="/dashboard"
				},2000)
	
			})
			.catch(err=>{
				console.log(err)
				toast.error("Something went wrong")
			})
			

		})
		.catch(err => {
			
			toast.error("Transaction failed")
		})

}
export const updateAuthorLikes= (authorId) => async (dispatch) => {
	
	
	await axios.put(`https://tipogram-h94e.onrender.com/dashboard/updateAuthorLikes/${authorId}`)
		.then(async (res) => {
			console.log(res)
			dispatch({
				type: UPDATE_AUTHOR_LIKES,
				payload: res
			})
		})
		.catch(err => {
			
			toast.error("Transaction failed")
		})

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