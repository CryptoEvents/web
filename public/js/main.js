let useraddress='0';
window.addEventListener('load', function() {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        window.web3Metamask = new Web3(web3.currentProvider);
        let contract = web3Metamask.eth.contract(contactABI);
        window.contractInstance = contract.at(mainContractAddress);
        web3.eth.getAccounts(function(error, result){
	    useraddress=result[0];
            $.get("/whois/"+result[0]).done(function(data){
                switch(data.type){
                    case 'superowner':
                        $("#adminCabinet")[0].style.display="block";
                        break;
                    case 'owner':
                        $("#ownerCabinet")[0].style.display="block";
                        break;
                    case 'user':
                        $("#userCabinet")[0].style.display="block";
                        break;
                    default:
                        break;
                };
            });
        });
    } else {
        let popup = $("#modal-metamask");
        popup.addClass("open");
    }

    // Now you can start your app & access web3 freely:


});

let createTokenForm = document.getElementById("createTokenForm");

if (createTokenForm){
    createTokenForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        e.stopPropagation();
        if (!window.web3Metamask){
            let popup = $("#modal-metamask");
            popup.addClass("open");
            return;
        }
        let form = new FormData(e.target);
        let name = form.get('name');
        let symbol = form.get('symbol');
        if (!name || !symbol){
            alert("Please provide token name or symbol");
            return;
        }
        contractInstance.deployNew(name,symbol,18,{value:1e16},function(a,b,c){
            alert("deployed");
            //ссылка на транзакцию или отслеживание когда апрувится и синхронизируется локальная нода,
            // ибо сразу человек не может работать с токенами
        });
    });

}

let joinToEvent = $(".joinToTheEvent");

if (joinToEvent.length>0){
    $.each(joinToEvent,function(i, item, arr){
        item.addEventListener('submit',(e)=> {
            e.preventDefault();
            e.stopPropagation();
            item[2].disabled = true;
            item[2].innerHTML = "wait";
            if (!window.web3Metamask) {
                let popup = $("#modal-metamask");
                popup.addClass("open");
                return;
            }
            let form = new FormData(e.target);
            let name = form.get('name');
            let user = useraddress
            let tokenAddress = form.get('tokenAddress');

            if (!name || !tokenAddress) {
                alert("Please provide your name");
                item[2].disabled = false;
                item[2].innerHTML = "Join";
                return;
            }
            $.post("/join", {name: name, address: useraddress, tokenAddress: tokenAddress},).done(function (data) {
                alert(data.success);
                item[2].disabled = false;
                item[2].innerHTML = "Join";
            });
        });
    });
}

$("#adminCabinet").on('click',(e)=>{
    $(location).attr('href','/admin/');
});
$("#ownerCabinet").on('click',(e)=>{
    $(location).attr('href','/owner/'+useraddress);
});
$("#userCabinet").on('click',(e)=>{
    $(location).attr('href','/user/'+useraddress);
});

if(typeof($("#sendTokenForm")[0])!='undefined' )
    $("#sendTokenForm")[0].addEventListener('submit',(e)=>{
        e.preventDefault();
        e.stopPropagation();
        if (!window.web3Metamask){
            let popup = $("#modal-metamask");
            popup.addClass("open");
            return;
        }
        let form = new FormData(e.target);
        let tokenAddress = form.get('tokenAddress');
        let amount = form.get('amount');
        let addressTo = form.get('addressTo');
        if (!tokenAddress || !amount || !addressTo){
            alert("Please provide token name or amount or user");
            return;
        }
        let token = web3Metamask.eth.contract(tokenABI);
        let tokenInstance = token.at(tokenAddress);
        tokenInstance.mint(addressTo,amount,function(a,b,c){
            alert("done");
        });

    });

$(".register-button").on('click',function(){
    $.post("/create").done(function(data){
        alert("Account adress:"+data.address+" Account private key"+data.privateKey);
    })
});


$(".transfer-button").on('click',function(){
    let popup = $("#modal-send");
    popup.addClass("open");
});
