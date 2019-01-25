module powerbi.extensibility.visual {

    interface DataPoint {
        category: string;
        value: number;
        colour: string;
    };

    interface ViewModel {
        dataPoints: DataPoint[];
        maxValue: number;
    };

    "use strict";
    export class Visual implements IVisual {

        private host: IVisualHost;                      //
        private svg: d3.Selection<SVGElementInstance>;
        private barGroup: d3.Selection<SVGElementInstance>;
        private xPadding: 0.1;

        constructor(options: VisualConstructorOptions) {
            // One-time Initialization Code
            console.log("1 - Constructor test");
            this.host = options.host;
            this.svg = d3.select(options.element)
                .append("svg")

            this.barGroup = this.svg.append("g")
                .classed("bar-group", true);

        }

        public update(options: VisualUpdateOptions) {
            // Called when viewport or data changes

            console.log("Updater enterance test");
        
            let viewModel = this.getViewModel(options);

            console.log("4 - ViewModel test datapoints update + maxValue", viewModel);

            // get width and Height info given by PowerBI Online
            let width = options.viewport.width;
            let height = options.viewport.height;

            this.svg.attr({

                width: width,
                height: height

            });

            console.log("5 - Width", width);
            console.log("6 - Height", height);

            // Screen Coordinate System, fourth Quadrant of the Co-ordinate System 
            // Horizontal Axis has Categorical Data
            // Using Ordinal Scale Range Round Bands Horizonatal Slice &

            let yScale = d3.scale.linear()
                .domain([0, viewModel.maxValue])
                .range([height, 0]);

            let xScale = d3.scale.ordinal()
                .domain(viewModel.dataPoints.map(d => d.category))
                .rangeRoundBands([0, width], 0.1);


            console.log("xpadding", this.xPadding);
            console.log("Width", width);
            console.log("yScale test", yScale);
            console.log("xScale test", xScale);
            console.log("*** 11 - Before Bar Update ***");

            //DataBinding Code to BarGroup

            let bars = this.barGroup
                .selectAll(".bar")
                .data(viewModel.dataPoints);

            // SVG rectangle elements mapped as child of bars     
            bars.enter()
                .append("rect")
                .classed("bar", true);

            bars
            .attr({
                width: xScale.rangeBand(),
                height: d => height - yScale(d.value),
                y: d => yScale(d.value),
                x: d => xScale(d.category)
            })
            .style({
                fill: d => d.colour
            });

            bars.exit()
                .remove()
            //.append("rect")
            //.classed("bar",false)
            console.log("****************** 12 - Update() End *************");
        }


        private getViewModel(options: VisualUpdateOptions): ViewModel {
            // gets data and specifications from capabilitis.json & Data sources

            let dv = options.dataViews;

            let viewModel: ViewModel = {
                dataPoints: [],
                maxValue: 0
            };

            // Conditions 
            if (!dv
                || !dv[0]
                || !dv[0].categorical
                || !dv[0].categorical.categories
                || !dv[0].categorical.categories[0].source
                || !dv[0].categorical.values[0])
                return viewModel;

            let view = dv[0].categorical;
            let categories = view.categories[0];
            let values = view.values[0];

            for (let i = 0, len = Math.max(categories.values.length, values.values.length); i < len; i++) {
                viewModel.dataPoints.push({
                    category: <string>categories.values[i],
                    value: <number>values.values[i],
                    colour: this.host.colorPalette.getColor(<string>categories.values[i]).value
                });
            }
 
        // maxValue of the data points is used as a reference to keep the orientation 
        // of the graph inside the SVG container relative to it's Max Point for 
        // dynamically filling up the chart

            viewModel.maxValue = d3.max(viewModel.dataPoints, d =>d.value);
            return viewModel;
        }



    }
}
