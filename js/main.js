'use strict';
//url to be used in the ajax call
var url = 'https://secure.shippingapis.com/ShippingApi.dll?API=RateV4&XML=<RateV4Request USERID="957000005318">';
var counter = 1;
var number = 1;
var form = document.getElementById('form');
var template = document.getElementById('template');
var appendTo = document.getElementById('line0');
var clear = document.getElementsByClassName('clear');
//calculates the sum of all elements of an array
function cal(a, b) {
    return a + b;
}

//Main function to calculates all values
function calculate() {

    //variables refrencing the DOM on submit
    var allData = [];
    var originZip = document.getElementById('originzip').value;
    var destinationZip = document.getElementById('destzip').value;

    //Required data for USPS
    for (var i = 1; i <= number; i++) {
        var weightOfBoxError = document.getElementById('weight' + i);
        var weightOfBox = weightOfBoxError.value;
        var numberOfBoxesError = document.getElementById('numberofboxes' + i);
        var numberOfBoxes = numberOfBoxesError.value;

        var data =
            '<Package ID="' + i + 'ST">' +
            '<Service>PRIORITY</Service>' +
            '<ZipOrigination>' + originZip + '</ZipOrigination>' +
            '<ZipDestination>' + destinationZip + '</ZipDestination>' +
            '<Pounds>' + weightOfBox + '</Pounds>' +
            '<Ounces>0</Ounces>' +
            '<Container>VARIABLE</Container>' +
            '<Size>LARGE</Size>' +
            '<Width>1</Width>' +
            '<Length>1</Length>' +
            '<Height>1</Height>' +
            '<Girth>1</Girth>' +
            '</Package>';
        allData.push(data);
        
        //error handeling for weight
        if (weightOfBox > 70) {
            weightOfBoxError.setCustomValidity("Weight must be 70 lbs or less");
            
        } else if (weightOfBox < 1) {
            weightOfBoxError.setCustomValidity("Weight must be greater then 0 lbs");
        } else {
            weightOfBoxError.setCustomValidity("");
        }
        //error handeling for number of boxes
        if (numberOfBoxes < 1) {
            numberOfBoxesError.setCustomValidity("Number of boxes must be 1 or more");
        } else {
            numberOfBoxesError.setCustomValidity("");
        }
    }
    //Retrives the shipping prices
    $.ajax({
        url: url + allData.join('') + '</RateV4Request>',
        success: function(data) {
            console.log(data);
            //clears shipping costs on each submit
            $(clear).val('');
            var grandTotalWeight = [];
            var grandNumberOfBoxes = [];
            var grandTotalCost = [];
            var zipError = $(data).find('RateV4Response > Package > Error > Description').html();

            //error handeling for zip codes
            if (zipError === 'Please enter a valid ZIP Code for the sender.  ' || zipError === 'The Origin ZIP Code you have entered is invalid.') {
                $('#error1').removeClass('hidden');
            } else {
                $('#error1').addClass('hidden');
            }

            if (zipError === 'Please enter a valid ZIP Code for the recipient.  ' || zipError === 'The Destination ZIP Code you have entered is invalid.') {
                $('#error2').removeClass('hidden');
            } else {
                $('#error2').addClass('hidden');
            }

            for (var i = 1; i <= number; i++) {
                //finds the rate from the XML file
                var rate = $(data).find('Package:nth-child(' + i + ') > Postage > Rate').text();
                //targets the "Price to ship per box" input box in the DOM
                var weightBox = document.getElementById('shipprice1box' + i);
                //stores the variable so it does not need to be called twice              
                var weight = $(weightBox);
                //applies the correct price to the correct box
                weight.val(weight.val() + '$' + rate);
                //targets the "Price to ship per box" input box and removes the $ so it can be multiplied
                var weightBox2 = document.getElementById('shipprice1box' + i).value.slice(1);
                //targets the "Number of Boxes" input box
                var numberOfBoxes = document.getElementById('numberofboxes' + i).value;
                //multiplies the price by the number of boxes
                var priceShipAll = weightBox2 * numberOfBoxes;
                //targets the "Price to ship all boxes" input box
                var totalforallboxesLine = document.getElementById('totalfl' + i);
                //if the number of boxes is greater than 0 apply number
                if (numberOfBoxes > 0) {
                    totalforallboxesLine.value = '$' + priceShipAll.toFixed(2);
                } else {
                    console.log("error");
                }

                //targets the "Weight in LBS" input box in the DOM
                var weightOfBox = document.getElementById('weight' + i).value;

                var calc = weightOfBox * numberOfBoxes;
                grandTotalWeight.push(Number(calc));
                grandNumberOfBoxes.push(Number(numberOfBoxes));
                grandTotalCost.push(Number(totalforallboxesLine.value.slice(1)));
            }

            //applies the totals to the inputs
            var totalWeightCal = grandTotalWeight.reduce(cal, 0);
            var totalBoxCal = grandNumberOfBoxes.reduce(cal, 0);
            var totalCostCal = grandTotalCost.reduce(cal, 0);
            document.getElementById('grandweight').value = totalWeightCal;
            document.getElementById('totalnumberofboxes').value = totalBoxCal;
            document.getElementById('pricetotalforallboxes').value = '$' + totalCostCal.toFixed(2);
        },
        error: function(data) {
            alert("USPS server is down");
        }
    });
}

var stored = $.each;
var myFunction = function() {
    $(this).removeAttr("id");
};

function numbers() {
    //changes the numbers for the line items
    stored($(".numbers"), function(index, value) {
        var num = index + 1 + ".";
        $(value).empty();
        $(value).append(num);
    });
    //changes the ids of the weight input box
    stored($(".weight-change"), function(index) {
        myFunction();
        $(this).attr("id", "weight" + index);
    });
    stored($(".onebox"), function(index) {
        myFunction();
        $(this).attr("id", "shipprice1box" + index);
    });
    stored($(".numofbox"), function(index) {
        myFunction();
        $(this).attr("id", "numberofboxes" + index);
    });
    stored($(".totalfl"), function(index) {
        myFunction();
        $(this).attr("id", "totalfl" + index);
    });
     stored($(".xxx"), function(index) {
        var idnum = index + 1;
        $(this).attr("id", "line" + idnum);

    });
}

function addTo() {
    ++number;
}

//removed line on click of the X
function removeLine(id) {
    $("#" + id).remove();
    --number;
    numbers();
}

//removes all added lines
function removeAllLines() {
    for(var i = 1; i <= 25; i++){
        $("#line" + i).remove();
    }
    number = 1;
}

//Duplicates the input box lines
function duplicate() {
    var clone = template.cloneNode(true);
    if (number < 25) {
        clone.id = 'line' + number;
        appendTo.parentNode.appendChild(clone);
        numbers();
        addTo();
        clone.classList.add("xxx");
    }
}