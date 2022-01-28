import * as d3 from "d3"
import ScrollyTeller from "shared/js/scrollyteller"

function init() {

	var width = document.querySelector("#data-viz2").getBoundingClientRect().width
	var height = window.innerHeight;
	console.log("width",width,"height", height)
	var mobile = false;

	if (width < 620) {
		mobile = true;
	}

	// var margin = {top: 100, right: 110, bottom: 100, left:20}

	// width = width - margin.left - margin.right,
	// height = height - margin.top - margin.bottom;

	var active = d3.select(null);
	var scaleFactor = width / 860
	var scope = d3.select("#data-viz2")

	var marginTop = 0.25 * height

	if (mobile) {
		marginTop = 0.45 * height
	}

	var data = {
			"over12":{
				"severe outcomes":{"vaccinated":123, "unvaccinated":49},
				"cases":{"vaccinated":93581, "unvaccinated":5450},
				"population":{"vaccinated":6402365, "unvaccinated":417798},
			},
			"over50":{
				"severe outcomes":{"vaccinated":97, "unvaccinated":31},
				"cases":{"vaccinated":22095, "unvaccinated":399},
				"population":{"vaccinated":2732188, "unvaccinated":34042},
			}
		}

	var categories = ["over12", "over50"]
	var per_thing = 100000

	// var severeColour = "#bd0026"
	// var casesColour = "#fd8d3c"
	// var populationColour = "#fed976"


	var severeColour = "#b51800"
	var casesColour = "#ff6699"
	var populationColour = "#6699cc"
	var ratesColour = "#990066"


	categories.forEach(function (cat) {
		data[cat]['outcomes_per_case'] =  { 
		"vaccinated":(data[cat]['severe outcomes']['vaccinated'] / data[cat]['cases']['vaccinated']) * per_thing,
		"unvaccinated":(data[cat]['severe outcomes']['unvaccinated'] / data[cat]['cases']['unvaccinated']) * per_thing
		}

		data[cat]['outcomes_per_pop'] =  { 
			"vaccinated":(data[cat]['severe outcomes']['vaccinated'] / data[cat]['population']['vaccinated']) * per_thing,
			"unvaccinated":(data[cat]['severe outcomes']['unvaccinated'] / data[cat]['population']['unvaccinated']) * per_thing
		}
	})

	function getMobileOperatingSystem() {
	    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

	    // Windows Phone must come first because its UA also contains "Android"
	    if (/windows phone/i.test(userAgent)) {
	        return "Windows Phone";
	    }

	    if (/android/i.test(userAgent)) {
	        return "Android";
	    }

	    // iOS detection from: http://stackoverflow.com/a/9039885/177710
	    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
	        return "iOS";
	    }

	    return "unknown";
	}

	var app = getMobileOperatingSystem()

	console.log(data, app)

	var maxRadius = d3.min([width * 0.23, height * 0.20])
	var vax_centre_x = width * 0.25
	var vax_centre_y = marginTop + maxRadius + 40

	var unvax_centre_x = width * 0.75
	var unvax_centre_y = marginTop + maxRadius + 40

	var minRadius = 2
	
	var transitionTime = 1000

	var f =	d3.format(",.3r")

	var textHeight = height * 0.82

	var radius = d3.scaleRadial()
	    .domain([1, d3.max([data['over12']['severe outcomes']['vaccinated'], data['over12']['severe outcomes']['unvaccinated']])])
	    .range([minRadius, maxRadius])

	scope.select("svg").remove()    

	var svg = scope.append("svg")
					.attr("width", width)
					.attr("height", height)
					.attr("id", "svg");		


	svg.append("svg:defs").selectAll("marker")
	    .data(["end"])      // Different link/path types can be defined here
	  .enter().append("svg:marker")    // This section adds in the arrows
	    .attr("id", 'arrow')
	    .attr("viewBox", "0 -5 10 10")
	    .attr("refX", 0)
	    .attr("refY", 0)
	    .attr("markerWidth", 10)
	    .attr("markerHeight", 10)
	    .attr("orient", "auto")
	  .append("svg:path")
	    .attr("d", "M0,-5L10,0L0,5")
	    .attr("fill", "#767676")


	var vaxLabel = svg.append("text")
		.attr("id", "vax_label")
		.attr("class", "big_labels")
		.attr("x", vax_centre_x)
		.attr("y", marginTop)
		.attr("text-anchor", "middle")
		.text("Vaccinated (50+)")

	var unvaxLabel = svg.append("text")
		.attr("id", "unvax_label")
		.attr("class", "big_labels")
		.attr("x", unvax_centre_x)
		.attr("y", marginTop)
		.attr("text-anchor", "middle")
		.text("Unvaccinated (50+)")    

	var vaxxed_pop = svg.append("circle")
			.attr("id", "vaxxed_pop")
			.attr("class", "bigCircle")
			.attr("cx", vax_centre_x)
			.attr("cy", vax_centre_y)
			.attr("r", width)
			.attr("opacity", 0)
			.attr("fill", populationColour)

	var unvaxxed_pop = svg.append("circle")
		.attr("id", "unvaxxed_pop")
		.attr("class", "bigCircle")
		.attr("cx", unvax_centre_x)
		.attr("cy", unvax_centre_y)
		.attr("r", width)
		.attr("opacity", 0)
		.attr("fill", populationColour)


	var unvax_label_line2 = svg.append("line")
		.attr("class", "statusText2")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", 0)
		.attr("y2", 0)
		.attr("opacity", 0)
		.attr("stroke", "#767676")		


	var vaxxed_cases = svg.append("circle")
			.attr("id", "vaxxed_cases")
			.attr("class", "bigCircle")
			.attr("cx", vax_centre_x)
			.attr("cy", vax_centre_y)
			.attr("r", width)
			.attr("opacity", 0)
			.attr("fill", casesColour)

	var unvaxxed_cases = svg.append("circle")
		.attr("id", "unvaxxed_cases")
		.attr("class", "bigCircle")
		.attr("cx", unvax_centre_x)
		.attr("cy", unvax_centre_y)
		.attr("r", width)
		.attr("opacity", 0)
		.attr("fill", casesColour)

	var vaxxed_outcomes = svg.append("circle")
			.attr("id", "vaxxed_outcomes")
			.attr("class", "bigCircle")
			.attr("cx", vax_centre_x)
			.attr("cy", vax_centre_y)
			.attr("r", 0)
			.attr("fill", severeColour)

	var unvaxxed_outcomes = svg.append("circle")
		.attr("id", "unvaxxed_outcomes")
		.attr("class","bigCircle")
		.attr("cx", unvax_centre_x)
		.attr("cy", unvax_centre_y)
		.attr("r", 0)
		.attr("fill", severeColour)

	var vax_status_text1 = svg.append("text")
		.attr("class", "statusText2")
		.attr("x", vax_centre_x)
		.attr("y", textHeight + (mobile ? 20:30))
		.attr("text-anchor", "middle")
		.text("")		

	var vax_status_text2 = svg.append("text")
		.attr("class", "statusText2")
		.attr("x", vax_centre_x)
		.attr("y", textHeight + (mobile ? 40 :60))
		.attr("text-anchor", "middle")
		.text("")

	var vax_status_text3 = svg.append("text")
		.attr("class", "statusText2")
		.attr("x", vax_centre_x)
		.attr("y", textHeight + (mobile ? 60:90))
		.attr("text-anchor", "middle")
		.text("")	

	var unvax_status_text1 = svg.append("text")
		.attr("class", "statusText2")
		.attr("x", unvax_centre_x)
		.attr("y", textHeight + (mobile ? 20:30))
		.attr("text-anchor", "middle")
		.text("")		

	var unvax_status_text2 = svg.append("text")
		.attr("class", "statusText2")
		.attr("x", unvax_centre_x)
		.attr("y", textHeight + (mobile ? 40 :60))
		.attr("text-anchor", "middle")
		.text("")

	var unvax_status_text3 = svg.append("text")
		.attr("class", "statusText2")
		.attr("x", unvax_centre_x)
		.attr("y", textHeight + (mobile ? 60:90))
		.attr("text-anchor", "middle")
		.text("")		

	svg.append("text")
		.attr("class", "statusText1")
		.attr("x", vax_centre_x)
		.attr("y", textHeight)
		.attr("text-anchor", "middle")
		.text("equals a rate of")

	svg.append("text")
		.attr("class", "statusText1")
		.attr("x", unvax_centre_x)
		.attr("y", textHeight)
		.attr("text-anchor", "middle")
		.text("equals a rate of")

	var vaxRateLine = svg.append("line")
		.attr("class", "statusText1")
		.attr("x1", vax_centre_x)
		.attr("y1", vax_centre_y)
		.attr("x2", vax_centre_x)
		.attr("y2", textHeight - 25)
		.attr("opacity", 0)
		.attr("stroke", "#767676")
		
	var unvaxRateLine = svg.append("line")
		.attr("class", "statusText1")
		.attr("x1", unvax_centre_x)
		.attr("y1", unvax_centre_y)
		.attr("x2", unvax_centre_x)
		.attr("y2", textHeight - 25)
		.attr("opacity", 0)
		.attr("stroke", "#767676")

	if (app != 'Android' && app != 'iOS') {
		vaxRateLine.attr("marker-end", "url(#arrow)")
		unvaxRateLine.attr("marker-end", "url(#arrow)")
	}

	if (app === 'Android' || app === 'iOS') {
		vaxRateLine.attr("y2", textHeight - 15)
		unvaxRateLine.attr("y2", textHeight -15)
	}		


	var vax_label_line = svg.append("line")
		.attr("class", "statusText2")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", 0)
		.attr("y2", 0)
		.attr("opacity", 0)
		.attr("stroke", "#767676")

	var unvax_label_line = svg.append("line")
		.attr("class", "statusText2")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", 0)
		.attr("y2", 0)
		.attr("opacity", 0)
		.attr("stroke", "#767676")

	var vax_label_value = svg.append("text")
		.attr("class", "vax_label_value")
		.attr("x", 0)
		.attr("y", 0)
		.attr("dx", 5)
		.attr("dy", 16)
		.attr("opacity", 0)
		.text("")	

	var unvax_label_value = svg.append("text")
		.attr("class", "vax_label_value")
		.attr("x", 0)
		.attr("y", 0)
		.attr("dx", 5)
		.attr("dy", 16)
		.attr("opacity", 0)
		.text("")		


	var vax_label_value2 = svg.append("text")
		.attr("class", "vax_label_value")
		.attr("x", vax_centre_x)
		.attr("y", vax_centre_y)
		.attr("dx", 10)
		.attr("dy", 8)
		.attr("opacity", 0)
		.text("")	

	var unvax_label_value2 = svg.append("text")
		.attr("class", "vax_label_value")
		.attr("x", unvax_centre_x)
		.attr("y", unvax_centre_y)
		.attr("dx", 5)
		.attr("dy", 8)
		.attr("opacity", 0)
		.text("")		

	// var unvax_status_text = scope.select("#unvax-text")

	function getCirclePoint(cx, cy, angle, radius) {
		var newX = (Math.cos(angle) * radius) + cx 
		var newY = (Math.sin(angle) * radius) + cy
		return [newX, newY]
	}


	const scrolly = new ScrollyTeller({
	            parent: document.querySelector("#scrolly-2"),
	            triggerTop: 1/3,
	            triggerTopMobile: 0.75,
	            transparentUntilActive: true
	});


	var trigger = 1

	function trigger1(cat) {
		trigger = 1
		radius.domain([1, d3.max([data[cat]['severe outcomes']['vaccinated'], data[cat]['severe outcomes']['unvaccinated']])])
			
		vaxxed_outcomes.transition('trans1').duration(transitionTime).attr("r", radius(data[cat]['severe outcomes']['vaccinated']))
		unvaxxed_outcomes.transition('trans1').duration(transitionTime).attr("r", radius( data[cat]['severe outcomes']['unvaccinated']))

		// vaxxed_cases.transition().duration(transitionTime).attr("r",width).attr("opacity", 0)
		// unvaxxed_cases.transition().duration(transitionTime).attr("r", width).attr("opacity", 0)

		vaxxed_pop.transition('trans1').duration(transitionTime).attr("r", width).attr("opacity", 0)
		unvaxxed_pop.transition('trans1').duration(transitionTime).attr("r", width).attr("opacity", 0)


		var newVaxPoints1
		var newVaxPoints2 

		if (mobile) {
			newVaxPoints1 = [vax_centre_x, vax_centre_y + radius(data[cat]['severe outcomes']['vaccinated'])]
			newVaxPoints2 = [vax_centre_x, vax_centre_y + radius(data[cat]['severe outcomes']['vaccinated']) + 20]
		}

		else {
			newVaxPoints1 = getCirclePoint(vax_centre_x, vax_centre_y, 5.49779,radius(data[cat]['severe outcomes']['vaccinated']))
			newVaxPoints2 = getCirclePoint(vax_centre_x, vax_centre_y, 5.49779,radius(data[cat]['severe outcomes']['vaccinated']) + 20)
		}

		vax_label_line.attr("opacity", 0)
		
		vax_label_line
			.attr("x1", newVaxPoints1[0])
			.attr("y1", newVaxPoints1[1])
			.attr("x2", newVaxPoints2[0])
			.attr("y2", newVaxPoints2[1])

		vax_label_value
			.attr("x", newVaxPoints2[0])
			.attr("y", newVaxPoints2[1] + (mobile ? 5:-20))
			.attr("opacity", 0)
			.attr("fill", severeColour)
			.attr("text-anchor", () => {
				if (mobile) {
					return 'middle'
				}
				else {
					return 'left'
				}
			})
			.html(`${data[cat]['severe outcomes']['vaccinated']} deaths<tspan x='${newVaxPoints2[0]}' dx=5 dy='${mobile ? 20 : 25}'>& ICU</tspan>`)
		
		vax_label_value2		
			.text("")
			.attr("opacity", 0)


		var newUnVaxPoints1 
		var newUnVaxPoints2 	

		if (mobile) {
			newUnVaxPoints1 = [unvax_centre_x, unvax_centre_y + radius(data[cat]['severe outcomes']['unvaccinated'])]
			newUnVaxPoints2 = [unvax_centre_x, unvax_centre_y + radius(data[cat]['severe outcomes']['unvaccinated']) + 20]
		}

		else {
			newUnVaxPoints1 = getCirclePoint(unvax_centre_x, unvax_centre_y, 5.49779,radius(data[cat]['severe outcomes']['unvaccinated']))
			newUnVaxPoints2 = getCirclePoint(unvax_centre_x, unvax_centre_y, 5.49779,radius(data[cat]['severe outcomes']['unvaccinated']) + 20)
		}

		
		unvax_label_line.attr("opacity", 0)
		
		unvax_label_line
			.attr("x1", newUnVaxPoints1[0])
			.attr("y1", newUnVaxPoints1[1])
			.attr("x2", newUnVaxPoints2[0])
			.attr("y2", newUnVaxPoints2[1])

		unvax_label_value
			.attr("x", newUnVaxPoints2[0])
			.attr("y", newUnVaxPoints2[1] + (mobile ? 5:-20))
			.attr("opacity", 0)
			.attr("fill", severeColour)
			.attr("text-anchor", () => {
				if (mobile) {
					return 'middle'
				}
				else {
					return 'left'
				}
			})
			.html(`${data[cat]['severe outcomes']['unvaccinated']} deaths<tspan x='${newUnVaxPoints2[0]}' dx=5 dy='${mobile ? 20 : 25}'>& ICU</tspan>`)	


		unvax_label_value2.attr("opacity", 0)
		unvax_label_line2.attr("opacity", 0)

		// vaxRateLine
		// 	.attr("x1", vax_centre_x)
		// 	.attr("y1", vax_centre_y + radius(data[cat]['severe outcomes']['vaccinated']) + 5)

		// unvaxRateLine
		// 	.attr("x1", unvax_centre_x)
		// 	.attr("y1", unvax_centre_y + radius(data[cat]['severe outcomes']['unvaccinated']) + 5)			

		scope.selectAll(".statusText1").attr("opacity", 0)

		vax_status_text1.attr("opacity", 0)
		vax_status_text2.attr("opacity", 0)
		unvax_status_text1.attr("opacity", 0)
		unvax_status_text2.attr("opacity", 0)

		setTimeout(function() {
			if (trigger === 1) {
						vax_label_line.transition('trans1').attr("opacity", 1)
						unvax_label_line.transition('trans1').attr("opacity", 1)
						unvax_label_value.transition('trans1').attr("opacity", 1)
						vax_label_value.transition('trans1').attr("opacity", 1)
						vax_status_text1.attr("opacity", 0)
						vax_status_text2.attr("opacity", 0)
						unvax_status_text1.attr("opacity", 0)
						unvax_status_text2.attr("opacity", 0)
						scope.selectAll(".statusText1").attr("opacity", 0)
			}
	
		}, 1000)
		
	}

	function trigger2(cat) {
		trigger = 2
		radius.domain([1, d3.max([data[cat]['population']['vaccinated'], data[cat]['population']['unvaccinated']])])
	    	
		// scope.select("#vaxxed_outcomes").transition("tran1").attr("r", radius(data['over12']['severe outcomes']['vaccinated']))
		vaxxed_outcomes.transition('trans2')
			.duration(transitionTime)
			.attr("r", radius(data[cat]['severe outcomes']['vaccinated']))
			.attr("opacity", 1)

		unvaxxed_outcomes.transition('trans2')
			.duration(transitionTime)
			.attr("r", radius(data[cat]['severe outcomes']['unvaccinated']))
			.attr("opacity", 1)

		vaxxed_cases.transition('trans2').duration(transitionTime).attr("r", radius(data[cat]['cases']['vaccinated']))
		unvaxxed_cases.transition('trans2').duration(transitionTime).attr("r", radius( data[cat]['cases']['unvaccinated']))

		// vaxxed_cases.transition().attr("r", 0)
		// unvaxxed_cases.transition().attr("r", 0)

		vaxxed_pop.transition().duration(transitionTime).attr("r", radius(data[cat]['population']['vaccinated'])).attr("opacity", 1)
		unvaxxed_pop.transition().duration(transitionTime).attr("r", radius(data[cat]['population']['unvaccinated'])).attr("opacity", 1)

		vaxxed_pop.transition()
			.duration(transitionTime)
			.attr("opacity", 1)
			.attr("r", radius(data[cat]['population']['vaccinated']))
			.attr("fill", populationColour)

		unvaxxed_pop.transition()
			.duration(transitionTime)
			.attr("opacity", 1)
			.attr("r", radius( data[cat]['population']['unvaccinated']))
			.attr("fill", populationColour)


		vax_status_text1
			.text(`${f(data[cat]['outcomes_per_pop']['vaccinated'])} severe outcomes`)
			.attr("fill", severeColour)
		
		unvax_status_text1
			.text(`${f(data[cat]['outcomes_per_pop']['unvaccinated'])} severe outcomes`)
			.attr("fill", severeColour)

		if (mobile) {

			vax_status_text2
				.text("per 100,000")
				.attr("fill", populationColour)

			vax_status_text3
				.text("vaccinated people")
				.attr("fill", populationColour)	

			unvax_status_text2
			.html("per 100,000")
			.attr("fill", populationColour)	

			unvax_status_text3
				.html("unvaccinated people")
				.attr("fill", populationColour)		
		}	

		
		else {
			vax_status_text2
			.text("per 100,000 vaccinated people")
			.attr("fill", populationColour)

			unvax_status_text2
			.html("per 100,000 unvaccinated people")
			.attr("fill", populationColour)	
		}	
	
		

		var newVaxPoints1 = getCirclePoint(vax_centre_x, vax_centre_y, 5.49779,radius(data[cat]['population']['vaccinated']))
		var newVaxPoints2 = getCirclePoint(vax_centre_x, vax_centre_y, 5.49779,radius(data[cat]['population']['vaccinated']) + 20)

		vax_label_line.attr("opacity", 0)
		
		vax_label_line
			.attr("x1", newVaxPoints1[0])
			.attr("y1", newVaxPoints1[1])
			.attr("x2", newVaxPoints2[0])
			.attr("y2", newVaxPoints2[1])

		vax_label_value
			.attr("x", newVaxPoints2[0])
			.attr("y", newVaxPoints2[1] - 20)
			.attr("opacity", 0)
			.attr("text-anchor", "left")
			.attr("fill", populationColour)
			.html(`${f(data[cat]['population']['vaccinated'])}<tspan x='${newVaxPoints2[0]}' dx=5 dy='${mobile ? 20 : 25}'>people</tspan>`)
				
		vax_label_value2		
			.html(`${data[cat]['severe outcomes']['vaccinated']} deaths<tspan x='${vax_centre_x}' dx=5 dy='${mobile ? 20 : 25}'>& ICU</tspan>`)
			.attr("fill", severeColour)
			.attr("opacity", 0)

		var newUnVaxPoints1 = getCirclePoint(unvax_centre_x, unvax_centre_y, 5.49779,radius(data[cat]['population']['unvaccinated']))
		var newUnVaxPoints2 = getCirclePoint(unvax_centre_x, unvax_centre_y, 5.49779,radius(data[cat]['population']['unvaccinated']) + 20)
		var newUnVaxPoints3 = getCirclePoint(unvax_centre_x, unvax_centre_y, 0.785398,radius(data[cat]['population']['unvaccinated']) + 20)

		unvax_label_line.attr("opacity", 0)
		
		unvax_label_line
			.attr("x1", newUnVaxPoints1[0])
			.attr("y1", newUnVaxPoints1[1])
			.attr("x2", newUnVaxPoints2[0])
			.attr("y2", newUnVaxPoints2[1])

		unvax_label_value
			.attr("x", newUnVaxPoints2[0])
			.attr("y", newUnVaxPoints2[1] - 20)
			.attr("opacity", 0)
			.attr("text-anchor", "left")
			.attr("fill", populationColour)
			.html(`${f(data[cat]['population']['unvaccinated'])}<tspan x='${newUnVaxPoints2[0]}' dx=5 dy='${mobile ? 20 : 25}'>people</tspan>`)	

		unvax_label_line2
			.attr("x1", unvax_centre_x)
			.attr("y1", unvax_centre_y)
			.attr("x2", newUnVaxPoints3[0])
			.attr("y2", newUnVaxPoints3[1])
			.attr("opacity", 0)		

		unvax_label_value2		
			.html(`${data[cat]['severe outcomes']['unvaccinated']} deaths<tspan x='${newUnVaxPoints3[0]}' dx=5 dy='${mobile ? 20 : 25}'>& ICU</tspan>`)
			.attr("fill", severeColour)
			.attr("x", newUnVaxPoints3[0])
			.attr("y", newUnVaxPoints3[1])
			.attr("opacity", 0)		

		vaxRateLine
			.attr("x1", vax_centre_x)
			.attr("y1", vax_centre_y + radius(data[cat]['population']['vaccinated']) + 5)

		unvaxRateLine
			.attr("x1", unvax_centre_x)
			.attr("y1", unvax_centre_y + radius(data[cat]['population']['unvaccinated']) + 5)			


		vax_status_text1.attr("opacity", 0)
		vax_status_text2.attr("opacity", 0)
		unvax_status_text1.attr("opacity", 0)
		unvax_status_text2.attr("opacity", 0)
		vax_status_text3.attr("opacity", 0)
		unvax_status_text3.attr("opacity", 0)
	
		scope.selectAll(".statusText1").attr("opacity", 0)	

		setTimeout(function() {

			if (trigger == 2) {
					vax_label_line.transition('trans2').attr("opacity", 1)
					unvax_label_line.transition('trans2').attr("opacity", 1)
					unvax_label_value.transition('trans2').attr("opacity", 1)
					unvax_label_line2.transition('trans2').attr("opacity", 1)
					unvax_label_value2.transition('trans2').attr("opacity", 1)
					vax_label_value.transition('trans2').attr("opacity", 1)
					vax_label_value2.transition('trans2').attr("opacity", 1)	
					vax_status_text1.transition('trans2').attr("opacity", 1)
					vax_status_text2.transition('trans2').attr("opacity", 1)
					unvax_status_text1.transition('trans2').attr("opacity", 1)
					unvax_status_text2.transition('trans2').attr("opacity", 1)
					unvax_status_text3.transition('trans2').attr("opacity", 1)
					vax_status_text3.transition('trans2').attr("opacity", 1)

					scope.selectAll(".statusText1").transition('trans2').attr("opacity", 1)
			}
	
		}, 1000)

	}

	function trigger3(cat) {
		trigger = 3
		radius.domain([1, d3.max([data[cat]['outcomes_per_pop']['vaccinated'], data[cat]['outcomes_per_pop']['unvaccinated']])])
	    	
		// scope.select("#vaxxed_outcomes").transition("tran1").attr("r", radius(data['over12']['severe outcomes']['vaccinated']))
		
		vaxxed_outcomes.transition('trans3')
			.duration(transitionTime)
			.attr("r", radius(data[cat]['outcomes_per_pop']['vaccinated']))
			.attr("opacity", 0)
		
		unvaxxed_outcomes
			.transition('trans3')
			.duration(transitionTime)
			.attr("r", radius( data[cat]['outcomes_per_pop']['unvaccinated']))
			.attr("opacity", 0)

		// vaxxed_cases.transition().duration(transitionTime).attr("r", radius(data[cat]['cases']['vaccinated']))
		// unvaxxed_cases.transition().duration(transitionTime).attr("r", radius( data[cat]['cases']['unvaccinated']))

		// vaxxed_cases.transition().attr("r", 0)
		// unvaxxed_cases.transition().attr("r", 0)

		vax_label_value2.attr("opacity", 0)
		unvax_label_value2.attr("opacity", 0)
		unvax_label_line2.attr("opacity", 0)

		vaxxed_pop.transition()
			.duration(transitionTime)
			.attr("opacity", 1)
			.attr("r", radius(data[cat]['outcomes_per_pop']['vaccinated']))
			.attr("fill", ratesColour)

		unvaxxed_pop.transition()
			.duration(transitionTime)
			.attr("opacity", 1)
			.attr("r", radius( data[cat]['outcomes_per_pop']['unvaccinated']))
			.attr("fill", ratesColour)

		vax_status_text1
			.text(`${f(data[cat]['outcomes_per_pop']['vaccinated'])} severe outcomes`)
			.attr("fill", severeColour)
		
		unvax_status_text1
			.text(`${f(data[cat]['outcomes_per_pop']['unvaccinated'])} severe outcomes`)
			.attr("fill", severeColour)

		if (mobile) {

			vax_status_text2
				.text("per 100,000")
				.attr("fill", populationColour)

			vax_status_text3
				.text("")
				.attr("fill", populationColour)	

			unvax_status_text2
			.html("per 100,000")
			.attr("fill", populationColour)	

			unvax_status_text3
				.html("unvaccinated people")
				.attr("fill", populationColour)		
		}	

		
		else {
			vax_status_text2
			.text("per 100,000 vaccinated people")
			.attr("fill", populationColour)

			unvax_status_text2
			.html("per 100,000 unvaccinated people")
			.attr("fill", populationColour)	
		}	
	
		var newVaxPoints1
		var newVaxPoints2

		if (mobile) {
			newVaxPoints1 = [vax_centre_x, vax_centre_y + radius(data[cat]['outcomes_per_pop']['vaccinated'])]
			newVaxPoints2 = [vax_centre_x, vax_centre_y + radius(data[cat]['outcomes_per_pop']['vaccinated']) + 20]
		}

		else {
			newVaxPoints1 = getCirclePoint(vax_centre_x, vax_centre_y, 5.49779,radius(data[cat]['outcomes_per_pop']['vaccinated']))
			newVaxPoints2 = getCirclePoint(vax_centre_x, vax_centre_y, 5.49779,radius(data[cat]['outcomes_per_pop']['vaccinated']) + 30)
		}	

		vax_label_line.attr("opacity", 0)
		
		vax_label_line
			.attr("x1", newVaxPoints1[0])
			.attr("y1", newVaxPoints1[1])
			.attr("x2", newVaxPoints2[0])
			.attr("y2", newVaxPoints2[1])

		vax_label_value
			.attr("x", newVaxPoints2[0])
			.attr("y", newVaxPoints2[1] + (mobile ? 5:-40))
			.attr("opacity", 0)
			.attr("fill", ratesColour)
			.attr("text-anchor", () => {
				if (mobile) {
					return 'middle'
				}
				else {
					return 'left'
				}
			})
			.html(`${f(data[cat]['outcomes_per_pop']['vaccinated'])} severe<tspan x='${newVaxPoints2[0]}' dx=5 dy='${mobile ? 20 : 25}'>outcomes</tspan><tspan x='${newVaxPoints2[0]}' dx=5 dy='${mobile ? 20 : 25}'>per 100,000</tspan>`)
				

		var newUnVaxPoints1 
		var newUnVaxPoints2 	

		if (mobile) {
			newUnVaxPoints1 = [unvax_centre_x, unvax_centre_y + radius(data[cat]['outcomes_per_pop']['unvaccinated'])]
			newUnVaxPoints2 = [unvax_centre_x, unvax_centre_y + radius(data[cat]['outcomes_per_pop']['unvaccinated']) + 20]
		}

		else {
			newUnVaxPoints1 = getCirclePoint(unvax_centre_x, unvax_centre_y, 5.49779,radius(data[cat]['outcomes_per_pop']['unvaccinated']))
			newUnVaxPoints2 = getCirclePoint(unvax_centre_x, unvax_centre_y, 5.49779,radius(data[cat]['outcomes_per_pop']['unvaccinated']) + 20)
		}
	
		unvax_label_line.attr("opacity", 0)
		
		unvax_label_line
			.attr("x1", newUnVaxPoints1[0])
			.attr("y1", newUnVaxPoints1[1])
			.attr("x2", newUnVaxPoints2[0])
			.attr("y2", newUnVaxPoints2[1])

		unvax_label_value
			.attr("x", newUnVaxPoints2[0])
			.attr("y", newUnVaxPoints2[1] + (mobile ? 5:-40))
			.attr("opacity", 0)
			.attr("fill", ratesColour)
			.attr("text-anchor", () => {
				if (mobile) {
					return 'middle'
				}
				else {
					return 'left'
				}
			})
			.html(`${f(data[cat]['outcomes_per_pop']['unvaccinated'])} severe<tspan x='${newUnVaxPoints2[0]}' dx=5 dy='${mobile ? 20 : 25}'>outcomes</tpan><tspan x='${newUnVaxPoints2[0]}' dx=5 dy='${mobile ? 20 : 25}'>per 100,000</tspan>`)	


		vax_status_text1.attr("opacity", 0)
		vax_status_text2.attr("opacity", 0)
		vax_status_text3.attr("opacity", 0)
		unvax_status_text1.attr("opacity", 0)
		unvax_status_text2.attr("opacity", 0)
		vax_status_text3.attr("opacity", 0)
		unvax_status_text3.attr("opacity", 0)
		scope.selectAll(".statusText1").attr("opacity", 0)	

		setTimeout(function() {
			if (trigger === 3) {
					vax_label_line.transition('trans3').attr("opacity", 1)
					unvax_label_line.transition('trans3').attr("opacity", 1)
					unvax_label_value.transition('trans3').attr("opacity", 1)
					vax_label_value.transition('trans3').attr("opacity", 1)
					// vax_status_text1.transition().attr("opacity", 0)
					// vax_status_text2.transition().attr("opacity", 0)
					// unvax_status_text1.transition().attr("opacity", 0)
					// unvax_status_text2.transition().attr("opacity", 0)
					// unvax_status_text3.transition().attr("opacity", 0)
					// vax_status_text3.transition('trans3').attr("opacity", 1)
					scope.selectAll(".statusText1").attr("opacity", 0)	
					// scope.selectAll(".statusText1").transition().attr("opacity", 1)

			}
		
		}, 1000)


	}

	var category = 'over50'

	scrolly.addTrigger({num: 1, do: () => {
			console.log(1)
			trigger1(category)
	}});	

	scrolly.addTrigger({num: 2, do: () => {
	    	console.log(2)
	    	trigger2(category)
			

	}});

	scrolly.addTrigger({num: 3, do: () => {
	    	console.log(3)
	    	trigger3(category)
	}});

	scrolly.watchScroll();

} // end init

init()

var to=null
var lastWidth = document.querySelector("#data-viz2").getBoundingClientRect()
window.addEventListener('resize', function() {

	var thisWidth = document.querySelector("#data-viz2").getBoundingClientRect()
	if (lastWidth != thisWidth) {
		
		window.clearTimeout(to);
		to = window.setTimeout(function() {
				init()
			}, 100)
	}
		
})
