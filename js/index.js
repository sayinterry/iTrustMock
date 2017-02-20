/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        //this.boot();
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.boot();
    },

    boot: function() {
        setup();
    }
};

app.initialize();

var registrationPages = [];
var questionnaire = [];
var questionIndex;
var transition = false;
var user; //JSON Object

var profile = {};
var investAmount = 0;

function setup() {
    //TODO: Page creation code


    //TODO: Splashscreen bool check
    localStorage.clear();

    if (localStorage.getItem("accounts") == null) {
        localStorage.setItem("accounts", JSON.stringify({
            "terry": {
                "newuser": true,
                "password": "12345",
                "email": null
            },
            "": {
                "newuser": true,
                "password": "",
                "email": null
            }
        }));
    }
    console.log(JSON.parse(localStorage.getItem("accounts")));

}

$("#form-login").submit(function(event) {
    event.preventDefault();

    user = $("#username").val();
    var pass = $("#password").val();

    var accounts = JSON.parse(localStorage.getItem("accounts"));
    if (user in accounts) {
        if (accounts[user].password === pass) {
            console.log("success");
            user = accounts[user];
            login();
        } else {
            console.log("fail");
            console.log(accounts[user].password)
            console.log(pass);
        }
    } else {
        console.log("no user");
    }

});

$("#form-register").submit(function(event) {
    event.preventDefault();

    user = $("#rusername").val();
    var pass = $("#rpassword").val();

    var accounts = JSON.parse(localStorage.getItem("accounts"));
    accounts[user] = {
        "newuser": true,
        "password": pass,
        "email": null
    }

    localStorage.setItem("accounts", JSON.stringify(accounts));

    pageTransition($("#registration"), $("#login"))

});

function login() {
    $("#login-registration").fadeOut(600, function() {
        $("#login-registration").remove();
        console.log("hi");
        loadQuestions();
    });


};

function loadQuestions() {

    var questions = [
        "What is your name?",
        "What is the name of the child you are opening this account for?",
        "In how many years from now do you expect the child to start college?",
        "What type of college do you want the child to attend?",
        "Let's create the right portfolio for your child's future."];
    var description = [
        "",

        ];
    var answers = [
        "First Name: <input type='text' name='fname'/><br>Last Name: <input type='text' name='lname'/><br>",
        "First Name: <input type='text' name='child-fname'/><br>Last Name: <input type='text' name='child-lname'/>" +
            "<br>Child's Age Bitch: <input type='text' name='child-age'/><br>" +
            "<label style='font-size: 0.7em'><input type='checkbox' name='nochild'/>I am saving for a student who has not been born yet.</label>",
        "<input type='number' name='years-to-college'/> Years",
        "<div style='text-align: left'><input type='radio' name='uni' value='4private'/> 4 year private (Harvard, Stanford, etc.)<br>" + 
            "<input type='radio' name='uni' value='4public'/> 4 year public (UVA, UNC - Chapel Hill, etc.)<br>" +
            "<input type='radio' name='uni' value='2private'/> 2 year private<br>" +
            "<input type='radio' name='uni' value='community'/> Community/junior college</div>",
        "<div style='width: 100%; text-align: left'>" +
            "<select name='relationship'><option selected disabled>How are you related to the child?</option>" +
                "<option>Grandparent</option>" +
                "<option>Parent</option>" +
                "<option>Uncle/Aunt</option>" +
                "<option>Sibling</option>" +
                "<option>Cousin</option>" +
                "<option>Family Friend</option>" +
                "<option>Other</option>" +
            "</select><br>" +
            "<select name='employment'><option selected disabled>What is your employment status?</option>" +
                "<option>Student</option>" +
                "<option>Retired</option>" +
                "<option>Unemployed</option>" +
                "<option>Full time</option>" +
                "<option>Part time</option>" +
                "<option>Self-employed</option>" +
            "</select><br>" +
            "<select name='yearlyincome'><option selected disabled>What is your yearly income?</option>" +
                "<option>Less than $25,000</option>" +
                "<option>$25,000 - $50,000</option>" +
                "<option>$50,000 - $100,000</option>" +
                "<option>$100,000 - $250,000</option>" +
                "<option>$250,000+</option>" +
            "</select><br>" +
            "<select name='assets'><option selected disabled>How much is all of your stuff(asses) worth?</option>" +
                "<option>Less than $50,000</option>" +
                "<option>$50,000 - $150,000</option>" +
                "<option>$150,000 - $500,000</option>" +
                "<option>$500,000 - $1,500,000</option>" +
                "<option>$1,500,000 - $3,000,000</option>" +
                "<option>$3,000,000+</option>" +
            "</select><br>" +
            "<select name='risktolerance'><option selected disabled>When investing, which do you care about more?</option>" +
                "<option value='aggressive'>Maximizing Gains</option>" +
                "<option value='conservative'>Minimizing Loss</option>" +
                "<option value='moderate'>Both</option>" +
            "</select><br>" +
        "</div>"];

    var q;

    for (var i=0; i<questions.length; i++) {
        q = new Question(questions[i], answers[i]);
        questionnaire.push(q);
        $("#questionnaire").append(q.html);
    }

    

    $("input[name='nochild']").click(function() {
        if ($(this).is(":checked")) {
            $("input[name='child-fname']").prop("disabled", true);
            $("input[name='child-lname']").prop("disabled", true);
        } else {
            $("input[name='child-fname']").prop("disabled", false);
            $("input[name='child-lname']").prop("disabled", false);
        }
    });

    $(".question").css("left", "150%");

    questionIndex = 0;
    $("#questionnaire").fadeIn(300);

    $("nav").show();
    $(".question:first").show();
    $(".question:first").animate({
        left:'50%'
    }, 500);

}

Chart.pluginService.register({
    afterDraw: function (chart, easing) {
        if (chart.config.options.showPercentage) {
            var self = chart.config;
            var ctx = chart.chart.ctx;

            ctx.font = '18px Arial';
            ctx.textAlign = "center";
            ctx.fillStyle = "#fff";
            
            self.data.datasets.forEach(function (dataset, datasetIndex) {               
                var total = 0, //total values to compute fraction
                    labelxy = [],
                    offset = Math.PI / 2, //start sector from top
                    radius,
                    centerx,
                    centery, 
                    lastend = 0; //prev arc's end line: starting with 0

                for (var val of dataset.data) { total += val; } 
                
                //TODO needs improvement
                var i = 0;
                var meta = dataset._meta[i];
                while(!meta) {
                    i++;
                    meta = dataset._meta[i];
                }
                
                var element;
                for(index = 0; index < meta.data.length; index++) {
                    
                    element = meta.data[index];
                    radius = 0.9 * element._view.outerRadius - element._view.innerRadius;
                    centerx = element._model.x;
                    centery = element._model.y;
                    var thispart = dataset.data[index],
                        arcsector = Math.PI * (2 * thispart / total);
                    if (element.hasValue() && dataset.data[index] > 0) {
                      labelxy.push(lastend + arcsector / 2 + Math.PI + offset);
                    }
                    else {
                      labelxy.push(-1);
                    }
                    lastend += arcsector;
                }


                var lradius = radius * 3 / 4;
                for (var idx in labelxy) {
                    if (labelxy[idx] === -1) continue;
                    var langle = labelxy[idx],
                    dx = centerx + lradius * Math.cos(langle),
                    dy = centery + lradius * Math.sin(langle),
                    val = Math.round(dataset.data[idx] / total * 100);
                    if (chart.config.options.showPercentage) {
                        ctx.font = "20pt Calibri";
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillText(chart.config.data.labels[idx], dx, dy);
                        ctx.font = "16pt Calibri";
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillText(val + '%', dx, dy + 27);
                    }
                }
                ctx.restore();
            });
        }
    }
});

function createChart() {
    var dataStocks;
    var dataBills;
    var dataBonds;
    var estimates;
    var cAge = profile["childAge"] || 0;


    if (cAge <= 4) {
        estimates = [[62.5, 37.5, 0], [87.5, 12.5, 0], [100, 0, 0]];
    } else if (cAge <= 6) {
        estimates = [[50, 50, 0], [75, 25, 0], [87.5, 12.5, 0]];
    } else if (cAge <= 8) {
        estimates = [[37.5, 62.5, 0], [62.5, 37.5, 0], [87.5, 12.5, 0]];
    } else if (cAge <= 10) {
        estimates = [[25, 75, 0], [50, 50, 0], [75, 25, 0]];
    } else if (cAge <= 12) {
        estimates = [[12.5, 87.5, 0], [37.5, 62.5, 0], [62.5, 37.5, 0]];
    } else if (cAge <= 14) {
        estimates = [[0, 75, 25], [25, 75, 0], [50, 50, 0]];
    } else if (cAge <= 16) {
        estimates = [[0, 50, 50], [12.5, 87.5, 0], [37.5, 82.5, 0]];
    } else if (cAge <= 18) {
        estimates = [[0, 25, 75], [0, 75, 25], [25, 75, 0]];
    } else {
        estimates = [[0, 0, 100], [0, 75, 25], [12.5, 87.5, 0]];
    }

    switch(profile["riskTolerance"]) {

        case "conservative":
            dataStocks = estimates[0][0];
            dataBonds = estimates[0][1];
            dataBills = estimates[0][2];
            break;
        case "moderate":
            dataStocks = estimates[1][0];
            dataBonds = estimates[1][1];
            dataBills = estimates[1][2];
            break;
        case "aggressive":
            dataStocks = estimates[2][0];
            dataBonds = estimates[2][1];
            dataBills = estimates[2][2];
            break;
        default:
            dataStocks = estimates[0][0];
            dataBonds = estimates[0][1];
            dataBills = estimates[0][2];
            break;
    }

    $("<canvas>").attr({
        id: "mychart"
    }).css({
        width: "300px"
    }).appendTo($("#piechart"));

    $("#mychart").height($("#mychart").width());

    var ctx = $("#mychart");
    var pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ["Stocks", "Bonds", "Treasury Bills"],
            datasets: [{
                data: [dataStocks, dataBonds, dataBills],
                backgroundColor: ['#E49640','#8CF457', '#1014C6']
            }]
        },
        options: {
            showPercentage: true,
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var allData = data.datasets[tooltipItem.datasetIndex].data;
                        var tooltipLabel = data.labels[tooltipItem.index];
                        var tooltipData = allData[tooltipItem.index];
                        var total = 0;
                        for (var i in allData) {
                            total += allData[i];
                        }
                        var tooltipPercentage = Math.round((tooltipData / total) * 100);
                        return tooltipLabel + ': ' + tooltipPercentage + '%';
                    }
                }
            }
        }
    });


}

function submitAnswers() {
    profile["fName"] = $("input[name='fname']").val();
    profile["lName"] = $("input[name='lname']").val();
    if ($("input[name='nochild']").is(":checked")) {
        profile["childFName"] = null;
        profile["childLName"] = null;
        profile["hasChild"] = false;
        profile["childAge"] = 0;
    } else {
        profile["childFName"] = $("input[name='child-fname']").val();
        profile["childLNname"] = $("input[name='child-lname']").val();
        profile["hasChild"] = true;
        profile["childAge"] = $("input[name='child-age']").val();
    }
    profile["yearsToCollege"] = $("input[name='years-to-college']").val();
    profile["typeOfCollege"] = $("input[type='radio']:checked").val();
    profile["relationship"] = $("select[name='relationship'] option:selected").text();
    profile["employment"] = $("select[name='employment'] option:selected").text();
    profile["yearlyIncome"] = $("select[name='yearlyincome'] option:selected").text();
    profile["assetWorth"] = $("select[name='assets'] option:selected").text();
    profile["riskTolerance"] = $("select[name='risktolerance']").val();
    profile["investmentAmount"] = 25;
}

$("#btn_next").click(function() {
    if ($("#mychart").length > 0) {
        if ($("#btn_next").text() == "Next Step") {
            generateQuestions();
            $("#piechart").animate({
                left: '-150%'
            }, 500);
            $("#btn_next").text("Next");
        } else {
            nextQuestion();
        }
    } else {
        if (questionIndex === questionnaire.length - 2) {
            nextQuestion();
            $("#btn_next").text("Submit");
        } else if(questionIndex === questionnaire.length - 1) {
            submitAnswers();
            $(".question").fadeOut(500, function() {
                $(".question").remove();
            });
            $("#btn_next").text("Next Step");
            createChart();
            setTimeout(function() {
                $("#piechart").fadeIn(400);
            }, 500);
        } else {
            nextQuestion();
        }
    }
});

$("input[name='group']").on("select", function() {
    var monthlyInvest = $("input[name='group']:selected").val();
    profile['investmentAmount'] = monthlyInvest;
    if (monthlyInvest == "other") {
        profile['investmentAmount'] = $("input[name='other']").text();
    }
    $("#investment-amount").text("$" + monthlyInvest);

    var returnAmount = Math.floor(monthlyInvest * 12 * Math.pow(1.06, profile["yearsToCollege"]) * 100) / 100;
    $("#return").text(returnAmount);
    //$("#tuition").text(tuition + "% of the projected tuition for your child.");
    console.log("wut")
});

function generateQuestions() {
    $("#questionnaire").hide();
    $(".question").remove();

    var questions = [
        "Initial Investment",
        "Monthly Investment"];
    var description = [
        "",

        ];
    var answers = [
        "<label><input type='radio' name='group' value='500'/>$500</label><br>" +
        "<label><input type='radio' name='group' value='250'/>$250</label><br>" +
        "<label><input type='radio' name='group' value='150'/>$150</label><br>" +
        "<label><input type='radio' name='group' value='50'/>$50</label><br>" +
        "<label><input type='radio' name='group' value='25' checked/>$25</label><br>" +
        "<label><input type='radio' name='group' value='other'/><input type='number' name='other' placeholder='Other' /></label><br>",
        "<div style='background: white; opacity: 0.8; width: 100%; border-radius: 20px'>" +
        "<span id='investment-amount'style='font-size: 1.2em; text-decoration: underline'>$50</span><br>" +
        "<span>By the time your child attends college, your return will be</span><br>" +
        "<span id='return' style='color: green'>$10,000</span><br>" +
        "<span style='font-size: 0.6em'>10% of the projected tuition for your child.</span>" +
        "</div>"];

    var q;

    for (var i=0; i<questions.length; i++) {
        q = new Question(questions[i], answers[i]);
        questionnaire.push(q);
        $("#questionnaire").append(q.html);
    }

    $("input[name='group']").click(function() {
        var monthlyInvest = $("input[name='group']:checked").val();
        profile['investmentAmount'] = monthlyInvest;
        if (monthlyInvest == "other") {
            profile['investmentAmount'] = $("input[name='other']").val();
        }
        $("#investment-amount").text("$" + monthlyInvest);

        console.log(monthlyInvest);
        console.log(profile["yearsToCollege"]);

        var apr = 0.06;
        var n = 12;

        var returnAmount = Math.floor((monthlyInvest * 12 * profile["yearsToCollege"]) + monthlyInvest * ((Math.pow(1 + (apr / n), n * profile["yearsToCollege"]) - 1) / (apr / n)) * 100) / 100;
        returnAmount = returnAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $("#return").text(returnAmount);

        //$("#tuition").text(tuition + "% of the projected tuition for your child.");
    });

    $(".question").css("left", "150%");

    questionIndex = 0;
    $("#questionnaire").fadeIn(300);

    $(".question:first").show();
    $(".question:first").animate({
        left:'50%'
    }, 500);
}

function pageTransition(p1, p2) {
    p1.toggle("puff");
    p2.toggle("puff");
}

$("#register").click(function() {
    pageTransition($("#login"), $("#registration"))
})

$("#btn_start").click(function() {
    $("#getstarted").toggle("puff");
    $("#login").toggle("puff");
});

$("#test").submit(function(event) {
    event.preventDefault();
});

$("#back").click(function() {
    if (questionIndex > 0)
        previousQuestion();
});

function nextQuestion() {
    if (!transition) {
        transition = true;
        $(".question:nth-child(" + (questionIndex + 2) +")").animate({
            left:'-150%'
        }, 500);
        questionIndex++;
        $(".question:nth-child(" + (questionIndex + 2) +")").animate({
            left:'50%'
        }, 500, function() {
            transition = false;
        });
    }
}

function previousQuestion() {
    if (!transition) {
        transition = true;
        $(".question:nth-child(" + (questionIndex + 2) +")").animate({
            left:'150%'
        }, 500);
        questionIndex--;
        $(".question:nth-child(" + (questionIndex + 2) +")").animate({
            left:'50%'
        }, 500, function() {
            transition = false;
        });
    }
}

$("#submit").click(function() {
    var num = 0;
    var cost = $("#cost").val();
    var years = $("#years").val();
    var percentage = $("#percentage").val() / 100;

    num = cost * percentage / (years * 12);
    num *= 100;
    num = Math.floor(num) / 100;
    console.log(num);
    $("#output").html("You have to save $" + num + " each month.");
});
//answers must be in a form
function Question(question, answer) {
    this.question = question;

    this.answers = answer;
    this.value;

    this.html = 
    "<div class='question'><h1 class='question-text'>" + question + "</h1>" +
    this.answers + "</div>"
}