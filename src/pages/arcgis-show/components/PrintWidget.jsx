import React from 'react';
import { loadModules } from 'esri-loader';
import style from './css/style.css';

let print=null;
class PrintWidget extends React.Component {

      constructor(props) {
        super(props);

        this.printRef = React.createRef();

        this.state = {

        };

    }

    componentDidMount() {
        loadModules(['esri/widgets/Print'])
            .then(([Print]) => {
                 print = new Print({
                    view: this.props.view,
                    container: this.printRef.current,
                    printServiceUrl:
                        "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
                });
                this.props.view.ui.add(print, "top-right");
            })
    }

    componentWillUnmount(){
        this.props.view.ui.remove(print);
    }

    render() {
        return (
            <div ref={this.printRef} className={style.print} />
        )
    }
}

export default PrintWidget;