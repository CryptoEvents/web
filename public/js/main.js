window.addEventListener('load', function() {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        window.web3Metamask = new Web3(web3.currentProvider);
        let contract = web3Metamask.eth.contract(contactABI);
        window.contractInstance = contract.at(mainContractAddress);
    } else {
        console.log("Metamask not installd");
    }

    // Now you can start your app & access web3 freely:


});

document.getElementById("createTokenForm").addEventListener('submit',(e)=>{
    e.preventDefault();
    e.stopPropagation();
    if (!window.web3Metamask){
        alert("Please enable matamask");
        // todo show form how to do this
        return;
    }
    let form = new FormData(e.target);
    let name = form.get('name');
    let symbol = form.get('symbol');
    if (!name || !symbol){
        alert("Please provide token name or symbol");
        return;
    }
    contractInstance.deployNew('TestEvent','tst',18,{value:1e16},function(a,b,c){console.log(a,b,c)});

    console.log(contractInstance);


    debugger
});