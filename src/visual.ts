
module powerbi.extensibility.visual {
    "use strict";
    export class Visual implements IVisual {
        
        constructor(options: VisualConstructorOptions) {
        
        }

        public update(options: VisualUpdateOptions) {
        
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