Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };
 
function set_uservalue(user){
		
			document.getElementById("roi_user").value=user;
		}
		function set_usermail(user_mail){
			document.getElementById("user_mail").value=user_mail;
		}
		jQuery.noConflict();
		jQuery( document ).ready(function( $ ) {
		//$('#calcbutton').click(function(){
			  //$('form[name=roicalculatter]').setAttrib('action','test/test_new.xls');
			//  $('form[name=roicalculatter]').submit();
			//});
			$(window).load(function() {
						$('#textbox8').hide();
						$('#textbox9').hide();
						$('#input_1_8').show();
						$('#input_1_9').show();
						$('#input_1_7').parent().children().addClass('green');
						
			});
			//$('input').keypress(function(e){
					 // if(e.keyCode==13)
						//return false;
				//	});
					$('#calcbutton').click(function(){
			
						$('#gform_11').submit();
						//return true;
					});
				
			$("#input_1_7").change(function() {
						var ccc7 = $('#input_1_7').val();
						ccc7 = ccc7.replace( "$" , "");
						ccc7 = ccc7.replace( "," , "");
						if(ccc7 <= 0)
						{	
							$('#input_1_7').parent().children().addClass('red').removeClass('black green');					
						}
						else{						
							$('#input_1_7').parent().children().removeClass('red').addClass('black');
						}
			});
			$("#input_1_8").change(function() {
					var ccc8 = $('#input_1_8').val();
					ccc8 = ccc8.replace( "$" , "");
					ccc8 = ccc8.replace( "," , "");
					ccc8 = parseFloat(ccc8);
					if(ccc8 <= 0)
					{
						$('#input_1_8').parent().children().addClass('green').removeClass('red');
						$('#input_1_8').hide();
						$('#textbox8').show();
						$('#textbox8').val('0');
						
					}
					else{
						
						$('#input_1_8').parent().children().removeClass('green').addClass('red');
						$('#textbox8').hide();
						$('#input_1_8').show();
					}
					if(ccc8 == 0){
						$('#input_1_8').show();
						$('#textbox8').hide();
					}	
			});	
		$("#input_1_11").change(function() {
					var ccc8 = $('#input_1_11').val();
					ccc8 = ccc8.replace( "$" , "");
					ccc8 = ccc8.replace( "," , "");
					ccc8 = parseFloat(ccc8);
                                        
                                        //console.log("ccc8: "+ccc8);
                                        
					if(ccc8 <= 0)
					{
						$('#input_1_11').hide();
						$('#input111').show();
					}
					else{						
						$('#input111').hide();
						$('#input_1_11').show();
					}
			});						
					$("#input_1_9").change(function() {
						var ccc9 = $('#input_1_9').val();
						ccc9 = ccc9.replace( "$" , "");
						ccc9 = ccc9.replace( "," , "");
						ccc9 = parseFloat(ccc9);
						
						if(ccc9 <= 0)
							{
								$('#input_1_9').parent().children().addClass('green').removeClass('red');
								$('#input_1_9').hide();
								$('#textbox9').show();
								$('#textbox9').val('0');
							}
							else{
								
								$('#input_1_9').parent().children().removeClass('green').addClass('red');
								$('#textbox9').hide();
								$('#input_1_9').show();
							}
					});	
					
			function goods(){

					var ccc7 = $('#input_1_7').val();
					//console.log(ccc7);
					ccc7 = ccc7.replace( "$" , "");
					ccc7 = ccc7.replace( "," , "");
					ccc7 = parseFloat(ccc7);
					if(ccc7 <= 0)
					{	
						$('#input_1_7').parent().children().addClass('red').removeClass('black green');					
					}
					else{						
						$('#input_1_7').parent().children().removeClass('red').addClass('black');
					}
					
					var ccc1 = $('#input_1_8').val();
					ccc1 = ccc1.replace( "$" , "");
					ccc1 = ccc1.replace( "," , "");
					ccc1 = parseFloat(ccc1);
					
					if(ccc1 <= 0)
					{
						$('#input_1_8').parent().children().addClass('green').removeClass('red');
						$('#input_1_8').hide();
						$('#textbox8').show();
						$('#textbox8').val('0');
						
					}
					else{
						
						$('#input_1_8').parent().children().removeClass('green').addClass('red');
						$('#textbox8').hide();
						$('#input_1_8').show();
					}				
					
					var ccc1 = $('#input_1_9').val();
					ccc1 = ccc1.replace( "$" , "");
					ccc1 = ccc1.replace( "," , "");
					ccc1 = parseFloat(ccc1);
					if(ccc1 <= 0)
					{
						$('#input_1_9').parent().children().addClass('green').removeClass('red');
						$('#input_1_9').hide();
						$('#textbox9').show();
						$('#textbox9').val('0');
					}
					else{
						
						$('#input_1_9').parent().children().removeClass('green').addClass('red');
						$('#textbox9').hide();
						$('#input_1_9').show();
					}
						
					
					var ccc1 = $('#input_1_10').val();
					ccc1 = ccc1.replace( "$" , "");
					ccc1 = ccc1.replace( "," , "");
					ccc1 = parseFloat(ccc1);
					if(ccc1 < 0)
					{
						$('#input_1_10').parent().children().addClass('red').removeClass('green');
						
					}
					else{
						
						$('#input_1_10').parent().children().removeClass('red').addClass('green');
					
					}
					

					
					
					var ccc1 = $('#input_1_11').val();
				
					
					ccc1 = ccc1.replace( "$" , "");
					ccc1 = ccc1.replace( "," , "");
					ccc1 = parseFloat(ccc1);

                                        //console.log("ccc1: "+ccc1);

					if(ccc1 < 0)
					{
						$('#input_1_11').parent().children().addClass('red').removeClass('green');
						$('#input_1_11').val('0');
					}
					else{
						
						$('#input_1_11').parent().children().removeClass('red').addClass('green');
					}
							
					
					var ccc1 = $('#input_1_12').val();

					ccc1 = ccc1.replace( "$" , "");
					ccc1 = ccc1.replace( "," , "");
					ccc1 = parseFloat(ccc1);
					if(ccc1 < 0)
					{
						$('#input_1_12').parent().children().addClass('red').removeClass('green');
					}
					else{
						
						$('#input_1_12').parent().children().removeClass('red').addClass('green');
					}
					

				}
								$(".c1").slider();
				$("#cl1SliderVal").keyup(function() {
                                        var tempVal = $(this).val();
                                            tempVal = tempVal.replace(",","");
						var ccc = parseInt(tempVal);
                                                ccc = Math.max(ccc,0);
						$('#totalgoal').val('$'+(ccc).formatMoney(0));
						$(".c1").slider({
						value: ccc,
						});
						$(".c1").slider('refresh');
					$(".c1").on("slide", function(slideEvt) {
						$( "#cl1SliderVal" ).val( slideEvt.value );
						setTimeout(function() {
							calchart();
						}, 500);
						goods();
						});
						setTimeout(function() {
							calchart();
						}, 500);
					goods();
				});
			
				/*$('#in_c1').on("click", function (event) {
				
				   	
					 var u8 = $( event.target ).parent().find('#cl1SliderVal').val();
					 u8 = parseInt(u8)+5;
				
					// u8+= 5;
				
					
					 $("#cl1SliderVal").val(u8);
					 $("#totalgoal").val(u8);
				
					 $(".c1").slider({
					     value: u8,


					     range: false
					 });

					$(".c1").slider('refresh');
					setTimeout(function() {
						calchart();
					}, 500);
					goods();
				
				});*/

				$('#in_c1').mousehold(100, function (event) {
					//alert(this.id);

				    var u8 = $(this).parent().find('#cl1SliderVal').val();
				    u8 = parseInt(u8) + 250;
                                    u8 = Math.max(u8,0);

				    // u8+= 5;


				    $("#cl1SliderVal").val(u8);
				    $("#totalgoal").val('$'+(u8).formatMoney(0));

				    $(".c1").slider({
				        value: u8,


				        range: false
				    });

				    $(".c1").slider('refresh');
				    setTimeout(function () {
				        calchart();
				    }, 500);
				    goods();

				});

				$('#de_c1').mousehold(100, function (event) {
					 var u8 = $( this ).parent().find('#cl1SliderVal').val();
					 u8 = parseInt(u8)-250;
                                         u8 = Math.max(u8,0);
					 
				
					
					$(".c1").slider({
					    value: u8,
					   
					    range: false
					});
					$(".c1").slider('refresh');
					$( "#cl1SliderVal" ).val( u8);
					$( "#totalgoal" ).val('$'+(u8).formatMoney(0));
					setTimeout(function() {
						calchart();
					}, 500);
					goods();
				});
			$(".c1").on("slide", function (slideEvt) {

			    $("#cl1SliderVal").val(slideEvt.value);
			    $("#totalgoal").val('$'+(slideEvt.value).formatMoney(0));
				setTimeout(function() {
						calchart();
					}, 500);
				goods();
			});
			$("#input_1_2").slider();
			
			$("#cl2SliderVal").keyup(function() {
                            var tempVal = $(this).val();
                                            tempVal = tempVal.replace(",","");
						var ccc = parseInt(tempVal);
                                                ccc = Math.max(ccc,0);
				
					$("#input_1_2").slider({
						value: ccc,
					});
					$("#input_1_2").slider('refresh');
					
					$("#input_1_2").on("slide", function(slideEvt) {
						$( "#cl2SliderVal" ).val( slideEvt.value );
						setTimeout(function() {
						calchart();
					}, 500);
						goods();
					});
				setTimeout(function() {
						calchart();
					}, 500);
				goods();
			});
			
			
			$('#in_c2').mousehold( 100, function( event ) {
				 var u8 = $( this ).parent().find('#cl2SliderVal').val();
				 u8 = parseInt(u8)+100;
                                 u8 = Math.max(u8,0);
				
			 
				$("#input_1_2").slider({
				    value: u8,
				    min: 0,
				    range: false
				});
				$("#input_1_2").slider('refresh');
				$( "#cl2SliderVal" ).val( u8);
				setTimeout(function() {
						calchart();
					}, 500);
				goods();
			
			});
			$('#de_c2').mousehold( 100, function( event ) {
				 var u8 = $(this ).parent().find('#cl2SliderVal').val();
				 u8 = parseInt(u8);
				 u8-= 100;
                                 u8 = Math.max(u8,0);
			
				$("#input_1_2").slider({
				    value: u8,
				    min: 0,
				    range: false
				});
				$("#input_1_2").slider('refresh');
				$( "#cl2SliderVal" ).val( u8);
				setTimeout(function() {
						calchart();
					}, 500);
				goods();
			});
			
			$("#input_1_2").on("slide", function(slideEvt) {
				$( "#cl2SliderVal" ).val( slideEvt.value );
				setTimeout(function() {
						calchart();
					}, 500);
				goods();
			});
			
			
			
			
			$("#input_1_3").slider();
			$("#cl3SliderVal").keyup(function() {
					var tempVal = $(this).val();
                                            tempVal = tempVal.replace(",","");
						var ccc = parseInt(tempVal);
                                                ccc = Math.max(ccc,0);
				
					$("#input_1_3").slider({
					value: ccc,
					});
					$("#input_1_3").slider('refresh');
				$("#input_1_3").on("slide", function(slideEvt) {
					$( "#cl3SliderVal" ).val( slideEvt.value );
					setTimeout(function() {
						calchart();
					}, 500);
					goods();
				});
				setTimeout(function() {
						calchart();
					}, 500);
				goods();
			});
			$('#in_c3').mousehold( 100, function( event ) {
				 var u8 = $( this ).parent().find('#cl3SliderVal').val();
				 u8 = parseInt(u8);
				 u8+= 10;
                                 u8 = Math.max(u8,0);
	
				$("#input_1_3").slider({
				    value: u8,
				    min: 0,
				    range: false
				});
				$("#input_1_3").slider('refresh');
				$( "#cl3SliderVal" ).val( u8);
				setTimeout(function() {
						calchart();
					}, 500);
				goods();
			
			});
			$('#de_c3').mousehold( 100, function( event ) {
				 var u8 = $( this).parent().find('#cl3SliderVal').val();
				 u8 = parseInt(u8);
				 u8-= 10;
                                 u8 = Math.max(u8,0);
				
				$("#input_1_3").slider({
				    value: u8,
				    min: 0,
				    range: false
				});
				$("#input_1_3").slider('refresh');
				$( "#cl3SliderVal" ).val( u8);
				setTimeout(function() {
						calchart();
					}, 500);
				goods();
			});
			$("#input_1_3").on("slide", function(slideEvt) {
				$( "#cl3SliderVal" ).val( slideEvt.value );
				setTimeout(function() {
						calchart();
					}, 500);
				goods();
			});
			
			
			
			$("#input_1_4").slider();
			$("#cl4SliderVal").keyup(function() {
					var tempVal = $(this).val();
                                            tempVal = tempVal.replace(",","");
						var ccc = parseInt(tempVal);
                                                ccc = Math.max(ccc,0);
					
				
					$("#input_1_4").slider({
					value: ccc,
					});
					$("#input_1_4").slider('refresh');
				$("#input_1_4").on("slide", function(slideEvt) {
					$( "#cl4SliderVal" ).val( slideEvt.value );
					setTimeout(function() {
						calchart();
					}, 500);
					goods();
				});
				setTimeout(function() {
						calchart();
					}, 500);
				goods();
			});
			$('#in_c4').mousehold( 100, function( event ) {
				 var u8 = $(this ).parent().find('#cl4SliderVal').val();
				 u8 = parseInt(u8);
				 u8+= 10;
                                 u8 = Math.max(u8,0);
		
				$("#input_1_4").slider({
				    value: u8,
				    min: 0,
				    range: false
				});
				$("#input_1_4").slider('refresh');
				$( "#cl4SliderVal" ).val( u8);
				setTimeout(function() {
						calchart();
					}, 500);
				goods();
			
			});
			$('#de_c4').mousehold( 100, function( event ) {
				 var u8 = $( this ).parent().find('#cl4SliderVal').val();
				 u8 = parseInt(u8);
				 u8-= 10;
                                 u8 = Math.max(u8,0);
		
				$("#input_1_4").slider({
				    value: u8,
				    min: 0,
				    range: false
				});
				$("#input_1_4").slider('refresh');
				$( "#cl4SliderVal" ).val( u8);
				setTimeout(function() {
						calchart();
					}, 500);
				goods();
			});
			$("#input_1_4").on("slide", function(slideEvt) {
				$( "#cl4SliderVal" ).val( slideEvt.value );
				setTimeout(function() {
						calchart();
					}, 500);
				goods();
			});
			
			
			
			$(".c3").slider();
			$("#cl5SliderVal").keyup(function() {
					var tempVal = $(this).val();
                                            tempVal = tempVal.replace(",","");
						var ccc = parseInt(tempVal);
                                                ccc = Math.max(ccc,0);
				
					$(".c3").slider({
					value: ccc,
					});
					$(".c3").slider('refresh');
				$(".c3").on("slide", function(slideEvt) {
					$( "#cl5SliderVal" ).val( slideEvt.value );
					setTimeout(function() {
						calchart();
					}, 500);
					goods();
				});
				setTimeout(function() {
						calchart();
					}, 500);
				goods();
			});
			$('#in_c6').mousehold( 100, function( event ) {
				 var u8 = $( this ).parent().find('#cl5SliderVal').val();
				 u8 = parseInt(u8);
				 u8+= 50;
                                 u8 = Math.max(u8,0);
			
				$(".c3").slider({
				    value: u8,
				    min: 0,
				    range: false
				});
				$(".c3").slider('refresh');
				$( "#cl5SliderVal" ).val( u8);
				setTimeout(function() {
						calchart();
					}, 500);
				goods();
			
			});
			$('#de_c6').mousehold( 100, function( event ) {
				 var u8 = $( this ).parent().find('#cl5SliderVal').val();
				 u8 = parseInt(u8);
				 u8-= 50;
                                 u8 = Math.max(u8,0);
				
				$(".c3").slider({
				    value: u8,
				    min: 0,
				    range: false
				});
				$(".c3").slider('refresh');
				$( "#cl5SliderVal" ).val( u8);
				setTimeout(function() {
						calchart();
					}, 500);
				goods();
			});
			$(".c3").on("slide", function(slideEvt) {
				$( "#cl5SliderVal" ).val( slideEvt.value );
				setTimeout(function() {
						calchart();
					}, 500);
				goods();
			});
			
			$("#de_c6,#in_c6").one("click", function() {
				$('#anm').fadeIn('slow');
					setTimeout(function() {
						  $('#anm').fadeOut('slow');
					}, 3000);
			});
			
			$("#cl5SliderVal").one("keyup", function() {
				$('#anm').fadeIn('slow');
					setTimeout(function() {
						  $('#anm').fadeOut('slow');
					}, 3000);
			});
			
			
			
			
			
			
			$(".c2").slider();
			$("#cl6SliderVal").keyup(function() {
					var tempVal = $(this).val();
                                            tempVal = tempVal.replace(",","");
						var ccc = parseInt(tempVal);
                                                ccc = Math.max(ccc,0);
				
					$(".c2").slider({
					value: ccc,

					});
					$(".c2").slider('refresh');
				$(".c2").on("slide", function(slideEvt) {
				$( "#cl6SliderVal" ).val( slideEvt.value );
				setTimeout(function() {
						calchart();
					}, 500);
				goods();
				});
				setTimeout(function() {
						calchart();
					}, 500);
				goods();
			});
			$('#in_c5').mousehold( 100, function( event ) {
				 var u8 = $( this ).parent().find('#cl6SliderVal').val();
				 u8 = parseInt(u8);
				 u8+= 250;
                                 u8 = Math.max(u8,0);
	
				$(".c2").slider({
				    min: 0,
				    range: false,
					value: u8,
				});
				$(".c2").slider('refresh');
				$( "#cl6SliderVal" ).val( u8);
				setTimeout(function() {
						calchart();
					}, 500);
				goods();
			
			});
			$('#de_c5').mousehold( 100, function( event ) {
				 var u8 = $( this ).parent().find('#cl6SliderVal').val();
				 u8 = parseInt(u8);
				 u8-= 250;
                                 u8 = Math.max(u8,0);
		
				$(".c2").slider({
				    value: u8,
				    min: 0,
				    range: false
				});
				$(".c2").slider('refresh');
				$( "#cl6SliderVal" ).val( u8);
				setTimeout(function() {
						calchart();
					}, 500);
				goods();
			});
			$(".c2").on("slide", function(slideEvt) {
				$( "#cl6SliderVal" ).val( slideEvt.value );
				setTimeout(function() {
						calchart();
					}, 500);
				goods();
			});
			
			setTimeout(function() {
						calchart();
					}, 500);
			
			
		});
			
		
	 function calchart()
	 {
             
		jQuery.noConflict();
		jQuery( document ).ready(function( $ ) {
		//var b1b1 = document.getElementById("input_1_16").value;
		var b1b1 = document.getElementById("input_1_11").value;
		b1b1 = b1b1.replace( "," , "");
		
		b1b1 =  parseFloat(b1b1)*10;
                jQuery('#textbox8').val(parseFloat(b1b1).formatMoney(0));
                jQuery('#input_1_8').val(parseFloat(b1b1).formatMoney(0));
		
                //console.log("b1b1 = "+b1b1.formatMoney(0));
                //$('#searc_volume').val("<br/><br/><br/><br/><br/>Search Volume Needed: " + b1b1.formatMoney(0));
		document.getElementById('searc_volume').innerHTML = "<br/><br/><br/><br/><br/>Search Volume Needed: " + b1b1.formatMoney(0);
			var chart;
			jQuery("p.a").html(document.getElementById("input_1_14").value) ;
				var hoveredColumn;
				var chartTooltips = [];

				jQuery(function () {
					jQuery('#container').highcharts({
						chart: {
							type: 'pie'
						},

						colors: [
							'#D03401',
							'#1A3C84',
							//'#3598DC',
							

						],
						tooltip: {
							formatter: function () {
								return this.point.name + ': <b>' + Highcharts.numberFormat(this.percentage, 1) + '</b>';
							},

							positioner: function () {
								return {
									x: 20,
									y: 90
								};
							},
							shared: false,
							useHTML: true
						},
						title: {
							text: ''
						},
						plotArea: {
							shadow: null,
							borderWidth: null,
							backgroundColor: null
						},

						 plotOptions: {
							pie: {
								allowPointSelect: true,
								cursor: 'pointer',
								dataLabels: {
									enabled: false,
									formatter: function () {
										return this.point.positive ? this.y : this.y * (-1);
									},
									color: 'black',
									style: {
										font: '13px Trebuchet MS, Verdana, sans-serif'
									}
									
								},
								showInLegend: true,
								
								point: {
									events: {
										legendItemClick: function () {
											return false; // <== returning false will cancel the default action
										}
									}
								},
							}
						},
					   
						legend: {
							enabled: true,
							borderWidth: 0,
							//width: 360,
							//itemWidth: 120,
							maxHeight: 9000,
							itemStyle: {
								//width: 120,
								color: '#53555C',
								fontFamily: 'segoe ui, sans-serif',
								fontSize: '11px',
								lineHeight: '15px',
								layout: 'horizontal',
							},
							
							itemHoverStyle: {
								color: '#4CA2D4'
							},
							
							labelFormatter: function () {
								//console.log(this);
								if (this.y === null) {
									return this.name + ': $' + this.options.y;
								} else {
									return this.name + ': $' + this.y;
								}
							},
							useHTML: true
						},
						series: [{
							data: [
								['Cost per lead',parseFloat( document.getElementById("input_1_14").value) ],
								['Cost per acquisition', parseFloat( document.getElementById("input_1_15").value)],
								//['Search volume',b1b1 ],
							]
						}]
					});
				});
			});
			jQuery( document ).ready(function( $ ) {
					var val3  = 0;
						var val0=jQuery('#cl2SliderVal').val();
                                                var tmpVal0 = val0.replace(',','');
                                                
					    jQuery('#input_1_11_01').val(parseFloat(tmpVal0).formatMoney(0));
						var val2=$('#input_1_11').val();
                                                val2 = val2.replace( "," , "");
						var zirr=0;
						if(val2 <= 0){							
							 jQuery('#input_1_11').val(parseFloat(zirr).formatMoney(0));
						}
						var val1=jQuery('#input_1_11_01').val();
						val2= val2.replace(',','');
						val1= val1.replace(',','');
						val3 = (parseFloat(val1) + parseFloat(val2));					  
						jQuery('#input_1_11_02').val((val3).formatMoney(0));
						jQuery('.visitor-goal-value').text((val3).formatMoney(0));
							
						var val13  = 0;
						var val0=jQuery('#cl3SliderVal').val();
                                                var tmpVal0 = val0.replace(',','');
					    jQuery('#input_1_10_01').val(parseFloat(tmpVal0).formatMoney(0));
						var val2=jQuery('#cl3SliderVal').val();
						
						var val1=jQuery('#input_1_10').val();
						val2= val2.replace(',','');
						val1= val1.replace(',','');
						var zirr=0;
						if(val1 <= 0){							
							 jQuery('#input_1_10').val(zirr);
						}
						val13 = (parseFloat(val1) + parseFloat(val2));					  
						jQuery('#input_1_10_02').val(val13.formatMoney(0));	
						
						var val03  = 0;
						var val0= jQuery('#cl4SliderVal').val();
                                                var tmpVal0 = val0.replace(',','');
					    jQuery('#input_1_12_01').val(parseFloat(tmpVal0).formatMoney(0));
						var val2= jQuery('#input_1_12').val();
						jQuery('#input_1_12').val();
						var zirr=0;
						if(val2 <= 0){							
							 jQuery('#input_1_12').val(zirr);
						}
						var val1= jQuery('#input_1_12_01').val();
						val2= val2.replace(',','');
						val1= val1.replace(',','');
						val03 = (parseFloat(val1) + parseFloat(val2));					  
						jQuery('#input_1_12_02').val(parseFloat(val03).formatMoney(0));

						var val04  = 0;
						//var val0= $('#input_1_2').val();
					    var val2= jQuery('#input_1_11').val();
						val2= val2.replace(',','');
						val04 = (parseFloat(val2) * 10);					  
						jQuery('#input_1_8').val(parseFloat(val04).formatMoney(0));	

						jQuery('#input_1_2').on('change',function(){
							var val1 = jQuery('#cl2SliderVal').val();
							jQuery('.cl2Slider_value').text(val1);
						})

						jQuery('#input_1_3').on('change',function(){
							var val1 = jQuery('#cl3SliderVal').val();
							jQuery('.cl3Slider_value').text(val1);
						})
						
/*						jQuery('#input_1_11').on('change',function(){
						var goalvalue = jQuery(this).val();
						jQuery('.visitor-goal-value').text(goalvalue);
						})*/
						
			});	
		}