
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
        
        private host: IVisualHost;
        private svg: d3.Selection<SVGElement>;
        private barGroup: d3.Selection<SVGElement>;
        private xPadding: 0.1;

        constructor(options: VisualConstructorOptions) {
            this.host = options.host;
            this.svg = d3.select(options.element)
                .append("svg")
                .classed("shippingLabelVisual", true);

            this.barGroup = this.svg.append("g")
                .classed("bar-group",true);
        }

        //Draw and redraws graphics
        public update(options: VisualUpdateOptions) {
            let sample: DataPoint[] = [
            {
                category: "This",
                value: 10
            },
            {
                category: "is",
                value: 30
            },
            {
                category: "some",
                value: 50
            },
            {
                category: "data",
                value: 20
            },
            {
                category: "points",
                value: 40
            }
      ];

      // maxValue of the data points is used as a reference to keep the orientation 
      // of the graph inside the SVG container relative to it's Max Point for 
      // dynamically filling up the chart
      

        let viewModel: ViewModel = {
            dataPoints: sample,
            maxValue: d3.max(sample, x => x.value) 
        };

        // get width and Height info given by PowerBI Online
        let width = options.viewport.width;
        let height = options.viewport.height;

        this.svg.attr({
        
            width: width,
            height: height
        
        });

        // Screen Coordinate System, fourth Quadrant of the Co-ordinate System 
        
        let yScale = d3.scale.linear()
            .domain([0, viewModel.maxValue])
            .range([height, 0]);

        // Horizontal Axis has Categorical Data
        // Using Ordinal Scale
        // Range Round Bands Horizonatal Slice & 

        let xScale = d3.scale.ordinal()
            .domain(viewModel.dataPoints.map(d => d.category))
            .rangeRoundBands([0,width], this.xPadding);


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

    }
/*         private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }
         
        // This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
        // objects and properties you want to expose to the users in the property pane.
        
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            // return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        }        
*/
    }
}