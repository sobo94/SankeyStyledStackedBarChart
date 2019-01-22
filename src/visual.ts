module powerbi.extensibility.visual {

    interface DataPoint {
        category: string;
        value: number;
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
                .classed("bar-group",true);

        }

        public update(options: VisualUpdateOptions) {
        // Called when viewport or data changes
        console.log("Updater enterance test");
            let sample: DataPoint[] = [
                {
                    category: "This",
                    value: 10
                },
                {
                    category: "is",
                    value: 40
                },
                {
                    category: "some",
                    value: 90
                },
                {
                    category: "data",
                    value: 123
                },
                {
                    category: "points",
                    value: 50
                },
                {
                    category: "is",
                    value: 65
                },
                {
                    category: "some",
                    value: 53
                },
                {
                    category: "data",
                    value: 123
                },
                {
                    category: "points",
                    value: 22
                }
          ];
          
          console.log("3 - Sample Dataset test", sample);

          // maxValue of the data points is used as a reference to keep the orientation 
          // of the graph inside the SVG container relative to it's Max Point for 
          // dynamically filling up the chart
          
    
            let viewModel: ViewModel = {
                dataPoints: sample,
                maxValue: d3.max(sample, x => x.value) 
            };
    
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
            
            let yScale = d3.scale.linear()
                .domain([0, viewModel.maxValue])
                .range([height, 0]);
    
            // Horizontal Axis has Categorical Data
            // Using Ordinal Scale Range Round Bands Horizonatal Slice &
    
            let xScale = d3.scale.ordinal()
                .domain(viewModel.dataPoints.map(d => d.category))
                .rangeRoundBands([0,width], 0.1);
                
                console.log("xpadding", this.xPadding);
                console.log("Width", width);
                console.log("yScale test", yScale);
                console.log("xScale test", xScale);
                console.log("*** 11 - Before Bar Update ***");
    
            //DataBinding Code
    
            let bars = this.barGroup
                .selectAll(".bar")
                .data(viewModel.dataPoints);
    
            // SVG rectangle elements mapped as child of bars     
            bars.enter()
                .append("rect")
                .classed("bar",true);
            
            bars.attr({
                width: xScale.rangeBand(),
                height: d => height - yScale(d.value),
                y: d => yScale(d.value),
                x: d => xScale(d.category)
            });

            bars.exit()
                .append("rect")
                .classed("bar",false)
                console.log("****************** 12 - Update() End *************");
    
        }
    }
}