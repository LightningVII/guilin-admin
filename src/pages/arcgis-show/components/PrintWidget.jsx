import React from 'react';
import { loadModules } from 'esri-loader';

class PrintWidget extends React.Component {
    constructor(props) {
        super(props);
        loadModules(['esri/widgets/Print'])
        .then(([Print]) => {
            const print = new Print({
                view: this.props.view,
                printServiceUrl:
                  "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
              });
              this.props.view.ui.add(print, "top-right");
        })       
    }

    render(){
        return null
    }
}

export default PrintWidget;