function iniCheck() {
    if (tts >= 10) {
        cancelCheckout();
        return;
    }

    tts++;

    $.ajax({
        data: { a: "abf08109cb590d4ded82feffb8bb176c" },
        success: function(r) {
            //console.log($.trim(r));
            PagSeguroDirectPayment.setSessionId(null);
            PagSeguroDirectPayment.setSessionId($.trim(r));
            hasSessionId = true;

            tts = 0;

            //sender hash
            sh = PagSeguroDirectPayment.getSenderHash();
            $("#senderHash").val(sh);
            console.log(sh);

            if ($('input[name=changePaymentMethod]:checked', th).val() == "CREDIT_CARD") {
                pgCCBrand();
            } else {
                fnlzPGto();
            }
        },
        error: function() {
            hasSessionId = false;
            cancelCheckout();
        }
    });

}

function pgCCBrand() {

    if (ttcc >= 5) {
        cancelCheckout();
        return;
    }

    ttcc++;

    if (sh == undefined || sh == '') {
        iniCheck();
        return;
    }



    //console.log($("#cardNumber").cleanVal());
    var cardBin = $("#cardNumber").cleanVal().substring(0, 6);
    //console.log(cardBin);
    PagSeguroDirectPayment.getBrand({
        cardBin: cardBin,
        success: function(r) {
            var brand = r.brand.name;
            console.log("pgCCBrand " + brand);
            //$("#cardBrand").attr('brand', brand);
            $("#creditCardBrand").val(brand);
            ttcc = 0;
            //console.log($("#creditCardBrand").val());
            //if($("#creditCardBrand").val() == undefined){                
            //cancelCheckout("Alguns dados do Cartão de Crédito não foram preenchidos ou estão incorretos. Por favor, verifique e tente novamente.");
            //} else {
            pgCCToken();
            //} 


        },
        error: function(r) {
            //console.log("erro pgCCBrand"); 
            hasSessionId = false;
            console.log(r);
            cancelCheckout("Alguns dados do Cartão de Crédito não foram preenchidos ou estão incorretos. Por favor, verifique e tente novamente. 2");
            //return false;
        },
        complete: function(r) {

        }
    });
}

function pgCCToken() {

    if ($("#creditCardBrand").val() == '') {
        pgCCBrand();
        return;
    }
    //console.log($("#cardExpirationYear").val());
    //console.log($("#cardNumber").val());

    PagSeguroDirectPayment.createCardToken({
        cardNumber: $("#cardNumber").cleanVal(),
        brand: $("#creditCardBrand").val(),
        cvv: $("#cardCvv").val(),
        expirationMonth: $("#cardExpirationMonth").val(),
        expirationYear: $("#cardExpirationYear").val(),
        success: function(r) {
            // Obtendo token para pagamento com cartão
            $("#creditCardToken").val(r.card.token);
            console.log(r);
            //return true;  

            //console.log($("#creditCardToken").val());

            //if($("#creditCardToken").val() == undefined){                
            //cancelCheckout("Alguns dados do Cartão de Crédito não foram preenchidos ou estão incorretos. Por favor, verifique e tente novamente.");
            //} else {
            fnlzPGto();
            //} 				
        },
        error: function(r) {
            hasSessionId = false;
            console.log(r);
            cancelCheckout("Alguns dados do Cartão de Crédito não foram preenchidos ou estão incorretos. Por favor, verifique e tente novamente. 3");
        },
        complete: function(r) {

        }
    });

}

function fnlzPGto() {

    //console.log(sh);

    if (sh == undefined || sh == '') {
        iniCheck();
        return;
    }
    /***
    //precisa?
    $("#cardNumber").val('');
	$("#cardCvv").val('');
	$("#cardExpirationMonth").val('');
	$("#cardExpirationYear").val('');
    ****/

    $.ajax({
        data: $("#checkout").serialize()
    }).done(
        function(r, s, x) {
            //console.log(r);
            /*$('#testes').html(r);
            $('#testes').show();
            console.log(r);*/

            var j;
            try {
                j = jQuery.parseJSON($.trim(r));
            } catch (err) {
                j = false;
            }

            if (typeof j == 'object') {
                if (typeof ga !== 'undefined' && $.isFunction(ga)) {
                    ga('send', 'event', 'checkout', 'success', '');
                }
                if (j.linkRedir != undefined && j.linkRedir != "") {
                    window.open(j.linkRedir, 'pgto', 'width=626,height=436');
                }
                window.location = j.link;
            } else {
                //exibirMensagens(r, 'alert-danger', 5);
                //msgFrm("checkout", r);
                cancelCheckout(r);

                /*if(typeof ga !== 'undefined' && $.isFunction(ga)){
                    ga('send', 'event', 'checkout', 'erro', 'inside');
                }*/
            }
            removeLoadBtn($("#checkout").find('button'));
            removeLoadFull();
            hasSessionId = false;
        });
}

function cancelCheckout(t) {
    console.log(t);
    tts = 0;
    ttcc = 0;
    hasSessionId = false;
    var tx = t != undefined ? t : "Ops.. Algum problema... Por favor, tente novamente...";

}