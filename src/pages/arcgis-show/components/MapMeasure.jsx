import React from 'react';
import { loadModules } from 'esri-loader';
import { Button, Divider, Icon } from 'antd';
import style from './style.css';

let EsriDistanceMesurement;
let EsriAreaMeasurement;
let MeasurementModel = null;

class MapMeasure extends React.Component {
  constructor(props) {
    super(props);

    // 设置 initial state
    this.state = {};

    loadModules(['esri/widgets/DistanceMeasurement2D', 'esri/widgets/AreaMeasurement2D']).then(
      ([DistanceMeasurement2D, AreaMeasurement2D]) => {
        EsriDistanceMesurement = DistanceMeasurement2D;
        EsriAreaMeasurement = AreaMeasurement2D;
      },
    );
  }

  componentWillReceiveProps() {
    if (this.props.showMeasure) this.destroyWidget();
  }

  lineMeasure = () => {
    this.destroyWidget();
    const mapView = this.props.view;
    MeasurementModel = new EsriDistanceMesurement({
      view: mapView,
      mode: 'geodesic',
    });
    MeasurementModel.viewModel.newMeasurement();
    mapView.ui.add(MeasurementModel, '' || 'bottom-left');
  };

  areaMeasure = () => {
    this.destroyWidget();
    const mapView = this.props.view;
    MeasurementModel = new EsriAreaMeasurement({
      view: mapView,
      mode: 'geodesic',
    });
    MeasurementModel.viewModel.newMeasurement();
    mapView.ui.add(MeasurementModel, '' || 'bottom-left');
  };

  destroyWidget = () => {
    const activeWidget = MeasurementModel;
    if (activeWidget) {
      this.props.view.ui.remove(activeWidget);
      activeWidget.destroy();
    }
    MeasurementModel = null;
  };

  closeCompents = () => {
    this.destroyWidget();
  };

  render() {
    return (
      <>
        {this.props.showMeasure ? (
          <>
            <Button className={style.measureBtn} onClick={this.lineMeasure}>
              <Icon type="line" /> 线测量
            </Button>
            <Button className={style.measureBtn} onClick={this.areaMeasure}>
              <Icon type="border" /> 面测量
            </Button>
            <div style={{ float: 'left' }}>
              <Divider type="vertical" style={{ margin: 5, height: 18 }} />
            </div>
            <Button className={style.measureBtn} onClick={this.destroyWidget}>
              <Icon type="delete" /> 清除
            </Button>
          </>
        ) : null}
      </>
    );
  }
}

export default MapMeasure;
