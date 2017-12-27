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
                if(data.type=='superowner')
                    $("#adminCabinet").removeClass("nonevisible");
                if(data.type=='owner')
                    $("#ownerCabinet").removeClass("nonevisible");
                if(data.type=='user')
                    $("#userCabinet").removeClass("nonevisible");
            });
        });
    } else {
        $(location).attr('href','/metamask/');
    }

    // Now you can start your app & access web3 freely:


});

let createTokenForm = document.getElementById("createTokenForm");

if (createTokenForm){
    createTokenForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        e.stopPropagation();
        if (!window.web3Metamask){
            $(location).attr('href','/metamask/');
        }
        let form = new FormData(e.target);
        let name = form.get('name');
        let symbol = form.get('symbol');
        if (!name || !symbol){
            let popup = $("#modal-alert");
            $("#titleAlert").text("Warning");
            $("#textAlert").text("Please provide token name or symbol");
            popup.addClass("open");
            return;
        }
        contractInstance.deployNew(name,symbol,18,{value:1e16},function(a,b,c){
            let popup = $("#modal-alert");
            if(a !== null){
                $("#titleAlert").text(a.name);
                $("#textAlert").text(a.message);
            } else {
                $("#titleAlert").text("Success");
                $("#textAlert").text("Deployed");
            }
            popup.addClass("open");
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
                $(location).attr('href','/metamask/');
            }
            let form = new FormData(e.target);
            let name = form.get('name');
            let user = useraddress
            let tokenAddress = form.get('tokenAddress');

            if (!name || !tokenAddress) {
                let popup = $("#modal-alert");
                $("#titleAlert").text("Warning");
                $("#textAlert").text("Please provide your name");
                popup.addClass("open");
                item[2].disabled = false;
                item[2].innerHTML = "Join";
                return;
            }
            $.post("/join", {name: name, address: useraddress, tokenAddress: tokenAddress},).done(function (data) {
                let popup = $("#modal-alert");
                $("#titleAlert").text("Success");
                $("#textAlert").text(data.success);
                popup.addClass("open");
                item[2].disabled = false;
                item[2].innerHTML = "Join";
            });
        });
    });
}

let givetoken = $(".givetoken");

if (givetoken.length>0){
    $.each(givetoken,function(i, item, arr){
        item.onclick= function(e) {
            e.preventDefault();
            e.stopPropagation();
            let address = this.id;
            let popup = $("#modal-send"+address);
            popup.addClass("open");
        };
    });
}

let gettoken = $(".gettoken");

if (gettoken.length>0){
    $.each(gettoken,function(i, item, arr){
        item.onclick= function(e) {
            e.preventDefault();
            e.stopPropagation();
            let address = this.id;
            let popup = $("#modal-get"+address);
            popup.addClass("open");
        };
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


let sendTokenForm = $(".sendTokenForm");

if (sendTokenForm.length>0){
    $.each(sendTokenForm,function(i, item, arr) {
        item.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!window.web3Metamask) {
                $(location).attr('href','/metamask/');
            }
            let form = new FormData(e.target);
            let tokenAddress = form.get('tokenAddress');
            let amount = form.get('amount');
            let addressTo = form.get('addressTo');
            if (!tokenAddress || !amount || !addressTo) {
                let popup = $("#modal-alert");
                $("#titleAlert").text("Warning");
                $("#textAlert").text("Please provide token name or amount or user");
                popup.addClass("open");
                return;
            }
            let token = web3Metamask.eth.contract(tokenABI);
            let tokenInstance = token.at(tokenAddress);
            tokenInstance.mint(addressTo, amount, function (a, b, c) {
                let popup = $("#modal-alert");
                if (a !== null) {
                    $("#titleAlert").text(a.name);
                    $("#textAlert").text(a.message);
                } else {
                    $("#titleAlert").text("Success");
                    $("#textAlert").text("done " + b);
                }
                popup.addClass("open");
            });
            tokenInstance.transfer(addressTo, amount, function (a, b, c) {
                let popup = $("#modal-alert");
                if (a !== null) {
                    $("#titleAlert").text(a.name);
                    $("#textAlert").text(a.message);
                } else {
                    $("#titleAlert").text("Success");
                    $("#textAlert").text("done " + b);
                }
                popup.addClass("open");
            });

        });
    });
}

let getTokenForm = $(".getTokenForm");

if (getTokenForm.length>0){
    $.each(getTokenForm,function(i, item, arr) {
        item.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!window.web3Metamask) {
                $(location).attr('href','/metamask/');
            }
            let form = new FormData(e.target);
            let tokenAddress = form.get('tokenAddress');
            let amount = form.get('amount');
            let addressFrom = form.get('addressFrom');
            if (!tokenAddress || !amount || !addressFrom) {
                let popup = $("#modal-alert");
                $("#titleAlert").text("Warning");
                $("#textAlert").text("Please provide token name or amount or user");
                popup.addClass("open");
                return;
            }
            let token = web3Metamask.eth.contract(tokenABI);
            let tokenInstance = token.at(tokenAddress);
            tokenInstance.transfer(addressFrom, amount, function (a, b, c) {
                let popup = $("#modal-alert");
                if (a !== null) {
                    $("#titleAlert").text(a.name);
                    $("#textAlert").text(a.message);
                } else {
                    $("#titleAlert").text("Success");
                    $("#textAlert").text("done " + b);
                }
                popup.addClass("open");
            });

        });
    });
}

$(".register-button").on('click',function(){
    $.post("/create").done(function(data){
        alert("Account adress:"+data.address+" Account private key"+data.privateKey);
    })
});


$(".transfer-button").on('click',function(){
    let popup = $("#modal-send");
    popup.addClass("open");
});
