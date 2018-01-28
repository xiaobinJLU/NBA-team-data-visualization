function draw(data)  {
	var svg = dimple.newSvg("#chartContainer", 900, 700);
	var indicator = new dimple.chart(svg, data);

	// 蓝色为默认，橙色为选中的年份
	var defaultColor = indicator.defaultColors[0];
	var indicatorColor = indicator.defaultColors[2];

	// 动画间隔时间
	var frame = 3000;

	var firstTick = true;

	// Place the indicator bar chart to the right

	indicator.setBounds(680, 60, 125, 350);

	// 添加日期到y轴
	var y = indicator.addCategoryAxis("y", "year");
	y.addOrderRule("year", "Desc");

	// 使用总得分作为隐藏的轴
	var x = indicator.addMeasureAxis("x", "sum_score");
	x.hidden = true;

	// Add the bars to the indicator and add event handlers
	var s = indicator.addSeries(null, dimple.plot.bar);
	s.addEventHandler("click", onClick);
	// Draw the side chart
	indicator.draw();

	// 去除掉y轴的题目与线
	y.titleShape.remove();
	y.shapes.selectAll("line,path").remove();

	// 去除掉y轴在画图区域的文本信息
	y.shapes.selectAll("text")
		  .style("text-anchor", "start")
		  .style("font-size", "11px")
		  .attr("transform", "translate(18, 0.5)");

	//添加图例标题
	svg.selectAll("title_text")
	    .data(["Click bar to select",
		"and pause. Click again",
		"to resume animation"])
	    .enter()
	    .append("text")
	    .attr("x", 680)
	    .attr("y", function (d, i) { return 15 + i * 12; })
	    .style("font-family", "sans-serif")
	    .style("font-size", "10px")
	    .style("color", "Black")
	    .text(function (d) { return d; });


	// Manually set the bar colors
	s.shapes
	  .attr("rx", 10)
	  .attr("ry", 10)
	  .style("fill", function (d) { return (d.y === '2000' ? indicatorColor.fill : defaultColor.fill) })
	  .style("stroke", function (d) { return (d.y === '2000' ? indicatorColor.stroke : defaultColor.stroke) })
	  .style("opacity", 0.4);

	// 画主要的图形
	var bubbles = new dimple.chart(svg, data);
        //更改配色  30个球队太多了没有找到合适的配色
        bubbles.defaultColors = [
          new dimple.color("#3498db", "#3498db", 1), // blue
          new dimple.color("#e74c3c", "#e74c3c", 1), // red
          new dimple.color("#2ecc71", "#2ecc71", 1), // green
          new dimple.color("#9b59b6", "#9b59b6", 1), // purple
          new dimple.color("#e67e22", "#e67e22", 1), // orange
          new dimple.color("#f39c12", "#f39c12", 1), // yellow
          new dimple.color("#1abc9c", "#1abc9c", 1), // turquoise
          new dimple.color("#95a5a6", "#95a5a6", 1), // gray
          new dimple.color("#55efc4", "#55efc4", 1),
          new dimple.color("#74b9ff", "#74b9ff", 1),
          new dimple.color("#3498db", "#3498db", 1),
          new dimple.color("#9b59b6", "#9b59b6", 1),
          new dimple.color("#34495e", "#34495e", 1),
          new dimple.color("#f1c40f", "#f1c40f", 1),
          new dimple.color("#e74c3c", "#e74c3c", 1),
          new dimple.color("#7f8c8d", "#7f8c8d", 1),
          new dimple.color("#eccc68", "#eccc68", 1),
          new dimple.color("#ff7f50", "#ff7f50", 1),
          new dimple.color("#ff6b81", "#ff6b81", 1),
          new dimple.color("#a4b0be", "#a4b0be", 1),
          new dimple.color("#f1c40f", "#f1c40f", 1),
          new dimple.color("#57606f", "#57606f", 1),
          new dimple.color("#ffa502", "#ffa502", 1),
          new dimple.color("#ff6348", "#ff6348", 1),
          new dimple.color("#747d8c", "#747d8c", 1),
          new dimple.color("#5352ed", "#5352ed", 1),
          new dimple.color("#3742fa", "#3742fa", 1),
          new dimple.color("#7158e2", "#7158e2", 1),
          new dimple.color("#fffa65", "#fffa65", 1),

      ];
	bubbles.setBounds(60,60 , 600, 350)
	bubbles.addMeasureAxis("x", "sum_score");
	bubbles.addMeasureAxis("y", "win_times");
	bubbles.addSeries(["team_name"], dimple.plot.bubble)
	bubbles.addLegend(60, 20, 650, 60);

	// 为主要的图形增加故事面板，设置刻度事件
	var story = bubbles.setStoryboard("year", onTick);
	// Change the frame duration
	story.frameDuration = frame;
	// Order the storyboard by date
	story.addOrderRule("year");

	// Draw the bubble chart
	bubbles.draw();

	//图例Orphan the legends as they are consistent but by default they will refresh on tick
	bubbles.legends = [];
	// Remove the storyboard label because the chart will indicate the
	// current month instead of the label
	story.storyLabel.remove();

	// On click of the side chart
	function onClick(e) {
	    // Pause the animation
	    story.pauseAnimation();
	    // If it is already selected resume the animation
	    // otherwise pause and move to the selected month
	    if (e.yValue === story.getFrameValue()) {
		story.startAnimation();
	    } else {
		story.goToFrame(e.yValue);
		story.pauseAnimation();
	    }
	}

	// On tick of the main charts storyboard
	function onTick(e) {
	    if (!firstTick) {
		// Color all shapes the same
		s.shapes
		    .transition()
		    .duration(frame / 2)
		    .style("fill", function (d) { return (d.y === e ? indicatorColor.fill : defaultColor.fill) })
		    .style("stroke", function (d) { return (d.y === e ? indicatorColor.stroke : defaultColor.stroke) });
	      }
	      firstTick = false;
	}
    };