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


	var severeColour = "#990066"
	var casesColour = "#ff6699"
	var populationColour = "#6699cc"


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

	console.log(data)


	var vax_centre_x = width * 0.25
	var vax_centre_y = height * 0.5

	var unvax_centre_x = width * 0.75
	var unvax_centre_y = height * 0.5

	var minRadius = 2
	var maxRadius = d3.min([width * 0.25, height * 0.25])
	var transitionTime = 1000

	var f =	d3.format(",.3r")

	var textHeight = height * 0.82

	var radius = d3.scaleRadial()
	    .domain([1, d3.max([data['over12']['severe outcomes']['vaccinated'], data['over12']['severe outcomes']['unvaccinated']])])
	    .range([minRadius, maxRadius])

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

	var vaxxed_pop = svg.append("circle")
			.attr("id", "vaxxed_pop")
			.attr("class", "")
			.attr("cx", vax_centre_x)
			.attr("cy", vax_centre_y)
			.attr("r", width)
			.attr("opacity", 0)
			.style("fill", populationColour)

	var unvaxxed_pop = svg.append("circle")
		.attr("id", "unvaxxed_pop")
		.attr("class", "")
		.attr("cx", unvax_centre_x)
		.attr("cy", unvax_centre_y)
		.attr("r", width)
		.attr("opacity", 0)
		.style("fill", populationColour)


	var vaxxed_cases = svg.append("circle")
			.attr("id", "vaxxed_cases")
			.attr("class", "")
			.attr("cx", vax_centre_x)
			.attr("cy", vax_centre_y)
			.attr("r", width)
			.attr("opacity", 0)
			.style("fill", casesColour)

	var unvaxxed_cases = svg.append("circle")
		.attr("id", "unvaxxed_cases")
		.attr("class", "")
		.attr("cx", unvax_centre_x)
		.attr("cy", unvax_centre_y)
		.attr("r", width)
		.attr("opacity", 0)
		.style("fill", casesColour)

	var vaxxed_outcomes = svg.append("circle")
			.attr("id", "vaxxed_outcomes")
			.attr("class", "")
			.attr("cx", vax_centre_x)
			.attr("cy", vax_centre_y)
			.attr("r", 0)
			.style("fill", severeColour)

	var unvaxxed_outcomes = svg.append("circle")
		.attr("id", "unvaxxed_outcomes")
		.attr("class", "")
		.attr("cx", unvax_centre_x)
		.attr("cy", unvax_centre_y)
		.attr("r", 0)
		.style("fill", severeColour)

	var vaxLabel = svg.append("text")
		.attr("id", "vax_label")
		.attr("class", "big_labels")
		.attr("x", vax_centre_x)
		.attr("y", height * 0.2)
		.attr("text-anchor", "middle")
		.text("Vaccinated")

	var unvaxLabel = svg.append("text")
		.attr("id", "unvax_label")
		.attr("class", "big_labels")
		.attr("x", unvax_centre_x)
		.attr("y", height * 0.2)
		.attr("text-anchor", "middle")
		.text("Unvaccinated")

	var vax_status_text1 = svg.append("text")
		.attr("class", "statusText2")
		.attr("x", vax_centre_x)
		.attr("y", textHeight + 30)
		.attr("text-anchor", "middle")
		.text("")		

	var vax_status_text2 = svg.append("text")
		.attr("class", "statusText2")
		.attr("x", vax_centre_x)
		.attr("y", textHeight + 60)
		.attr("text-anchor", "middle")
		.text("")

	var vax_status_text3 = svg.append("text")
		.attr("class", "statusText2")
		.attr("x", vax_centre_x)
		.attr("y", textHeight + 90)
		.attr("text-anchor", "middle")
		.text("")	

	var unvax_status_text1 = svg.append("text")
		.attr("class", "statusText2")
		.attr("x", unvax_centre_x)
		.attr("y", textHeight + 30)
		.attr("text-anchor", "middle")
		.text("")		

	var unvax_status_text2 = svg.append("text")
		.attr("class", "statusText2")
		.attr("x", unvax_centre_x)
		.attr("y", textHeight + 60)
		.attr("text-anchor", "middle")
		.text("")

	var unvax_status_text3 = svg.append("text")
		.attr("class", "statusText2")
		.attr("x", unvax_centre_x)
		.attr("y", textHeight + 90)
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
		.attr("x2", vax_centre_x)
		.attr("y2", textHeight - 25)
		.attr("opacity", 0)
		.attr("stroke", "#767676")
		.attr("marker-end", "url(#arrow)")

	var unvaxRateLine = svg.append("line")
		.attr("class", "statusText1")
		.attr("x2", unvax_centre_x)
		.attr("y2", textHeight - 25)
		.attr("opacity", 0)
		.attr("stroke", "#767676")
		.attr("marker-end", "url(#arrow)")	

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


	function trigger1(cat) {
		radius.domain([1, d3.max([data[cat]['severe outcomes']['vaccinated'], data[cat]['severe outcomes']['unvaccinated']])])
			
		vaxxed_outcomes.transition().duration(transitionTime).attr("r", radius(data[cat]['severe outcomes']['vaccinated']))
		unvaxxed_outcomes.transition().duration(transitionTime).attr("r", radius( data[cat]['severe outcomes']['unvaccinated']))

		vaxxed_cases.transition().duration(transitionTime).attr("r",width).attr("opacity", 0)
		unvaxxed_cases.transition().duration(transitionTime).attr("r", width).attr("opacity", 0)

		var newVaxPoints1 = getCirclePoint(vax_centre_x, vax_centre_y, 5.49779,radius(data[cat]['severe outcomes']['vaccinated']))
		var newVaxPoints2 = getCirclePoint(vax_centre_x, vax_centre_y, 5.49779,radius(data[cat]['severe outcomes']['vaccinated']) + 20)

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
			.attr("fill", severeColour)
			.text(data[cat]['severe outcomes']['vaccinated'])
				

		var newUnVaxPoints1 = getCirclePoint(unvax_centre_x, unvax_centre_y, 5.49779,radius(data[cat]['severe outcomes']['unvaccinated']))
		var newUnVaxPoints2 = getCirclePoint(unvax_centre_x, unvax_centre_y, 5.49779,radius(data[cat]['severe outcomes']['unvaccinated']) + 20)

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
			.attr("fill", severeColour)
			.text(data[cat]['severe outcomes']['unvaccinated'])	


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
			vax_label_line.transition().attr("opacity", 1)
			unvax_label_line.transition().attr("opacity", 1)
			unvax_label_value.transition().attr("opacity", 1)
			vax_label_value.transition().attr("opacity", 1)
			vax_status_text1.attr("opacity", 0)
			vax_status_text2.attr("opacity", 0)
			unvax_status_text1.attr("opacity", 0)
			unvax_status_text2.attr("opacity", 0)
			scope.selectAll(".statusText1").attr("opacity", 0)
		}, 1000)
		
	}

	function trigger2(cat) {
		radius.domain([1, d3.max([data[cat]['cases']['vaccinated'], data['over12']['cases']['unvaccinated']])])
		
		vaxxed_outcomes.transition().duration(transitionTime).attr("r", radius(data[cat]['severe outcomes']['vaccinated']))
		unvaxxed_outcomes.transition().duration(transitionTime).attr("r", radius( data[cat]['severe outcomes']['unvaccinated']))

		vaxxed_cases.transition().duration(transitionTime).attr("r", radius(data[cat]['cases']['vaccinated'])).attr("opacity", 1)
		unvaxxed_cases.transition().duration(transitionTime).attr("r", radius( data[cat]['cases']['unvaccinated'])).attr("opacity", 1)

		vaxxed_pop.transition().duration(transitionTime).attr("r", width).attr("opacity", 0)
		unvaxxed_pop.transition().duration(transitionTime).attr("r", width).attr("opacity", 0)


		vax_status_text1
			.text(`${f(data[cat]['outcomes_per_case']['vaccinated'])} severe outcomes`)
			.attr("fill", severeColour)
		
		vax_status_text2
			.text("per 100,000 cases")
			.attr("fill", casesColour)

		unvax_status_text1
			.text(`${f(data[cat]['outcomes_per_case']['unvaccinated'])} severe outcomes`)
			.attr("fill", severeColour)
		
		unvax_status_text2
			.text("per 100,000 cases")
			.attr("fill", casesColour)	

		var newVaxPoints1 = getCirclePoint(vax_centre_x, vax_centre_y, 5.49779,radius(data[cat]['cases']['vaccinated']))
		var newVaxPoints2 = getCirclePoint(vax_centre_x, vax_centre_y, 5.49779,radius(data[cat]['cases']['vaccinated']) + 20)

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
			.attr("fill", casesColour)
			.text(f(data[cat]['cases']['vaccinated']))
				

		var newUnVaxPoints1 = getCirclePoint(unvax_centre_x, unvax_centre_y, 5.49779,radius(data[cat]['cases']['unvaccinated']))
		var newUnVaxPoints2 = getCirclePoint(unvax_centre_x, unvax_centre_y, 5.49779,radius(data[cat]['cases']['unvaccinated']) + 20)

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
			.attr("fill", casesColour)
			.text(f(data[cat]['cases']['unvaccinated']))

		vaxRateLine
			.attr("x1", vax_centre_x)
			.attr("y1", vax_centre_y + radius(data[cat]['cases']['vaccinated']) + 5)

		unvaxRateLine
			.attr("x1", unvax_centre_x)
			.attr("y1", unvax_centre_y + radius(data[cat]['cases']['unvaccinated']) + 5)		


		vax_status_text1.attr("opacity", 0)
		vax_status_text2.attr("opacity", 0)
		unvax_status_text1.attr("opacity", 0)
		unvax_status_text2.attr("opacity", 0)

		vax_status_text3.text("").attr("opacity", 0)
		unvax_status_text3.text("").attr("opacity", 0)

		scope.selectAll(".statusText1").attr("opacity", 0)

		setTimeout(function() {
			vax_label_line.transition().attr("opacity", 1)
			unvax_label_line.transition().attr("opacity", 1)
			unvax_label_value.transition().attr("opacity", 1)
			vax_label_value.transition().attr("opacity", 1)
			vax_status_text1.transition().attr("opacity", 1)
			vax_status_text2.transition().attr("opacity", 1)
			unvax_status_text1.transition().attr("opacity", 1)
			unvax_status_text2.transition().attr("opacity", 1)
			scope.selectAll(".statusText1").transition().attr("opacity", 1)

		}, 1000)

	}

	function trigger3(cat) {
		radius.domain([1, d3.max([data[cat]['population']['vaccinated'], data[cat]['population']['unvaccinated']])])
	    	
		// scope.select("#vaxxed_outcomes").transition("tran1").attr("r", radius(data['over12']['severe outcomes']['vaccinated']))
		vaxxed_outcomes.transition().duration(transitionTime).attr("r", radius(data[cat]['severe outcomes']['vaccinated']))
		unvaxxed_outcomes.transition().duration(transitionTime).attr("r", radius(data[cat]['severe outcomes']['unvaccinated']))

		vaxxed_cases.transition().duration(transitionTime).attr("r", radius(data[cat]['cases']['vaccinated']))
		unvaxxed_cases.transition().duration(transitionTime).attr("r", radius( data[cat]['cases']['unvaccinated']))

		// vaxxed_cases.transition().attr("r", 0)
		// unvaxxed_cases.transition().attr("r", 0)

		vaxxed_pop.transition().duration(transitionTime).attr("r", radius(data[cat]['population']['vaccinated'])).attr("opacity", 1)
		unvaxxed_pop.transition().duration(transitionTime).attr("r", radius( data[cat]['population']['unvaccinated'])).attr("opacity", 1)

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
			.attr("fill", populationColour)
			.text(f(data[cat]['population']['vaccinated']))
				

		var newUnVaxPoints1 = getCirclePoint(unvax_centre_x, unvax_centre_y, 5.49779,radius(data[cat]['population']['unvaccinated']))
		var newUnVaxPoints2 = getCirclePoint(unvax_centre_x, unvax_centre_y, 5.49779,radius(data[cat]['population']['unvaccinated']) + 20)

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
			.attr("fill", populationColour)
			.text(f(data[cat]['population']['unvaccinated']))	


		vax_status_text1.attr("opacity", 0)
		vax_status_text2.attr("opacity", 0)
		unvax_status_text1.attr("opacity", 0)
		unvax_status_text2.attr("opacity", 0)
		vax_status_text3.attr("opacity", 0)
		unvax_status_text3.attr("opacity", 0)
		
		
		scope.selectAll(".statusText1").attr("opacity", 0)	

		setTimeout(function() {
			vax_label_line.transition().attr("opacity", 1)
			unvax_label_line.transition().attr("opacity", 1)
			unvax_label_value.transition().attr("opacity", 1)
			vax_label_value.transition().attr("opacity", 1)
			vax_status_text1.transition().attr("opacity", 1)
			vax_status_text2.transition().attr("opacity", 1)
			unvax_status_text1.transition().attr("opacity", 1)
			unvax_status_text2.transition().attr("opacity", 1)
			unvax_status_text3.transition().attr("opacity", 1)
			vax_status_text3.transition().attr("opacity", 1)

			scope.selectAll(".statusText1").transition().attr("opacity", 1)
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
