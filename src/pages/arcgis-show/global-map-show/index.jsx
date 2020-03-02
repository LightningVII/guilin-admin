import React, { Suspense } from 'react';
import { Row, Col, Affix, Menu, Button, Dropdown, Icon, Card, message } from 'antd';
// import { Map } from '@esri/react-arcgis';
// import { WebMapView } from './BaseMap';
// import MyBasemap from '../components/MyBasemap';

import SearchGIS from '../components/SearchGIS';
import Compass from '../components/Compass';
import MapMeasure from '../components/MapMeasure';
import ModalSwipeTree from '../components/ModalSwipeTree';
import MapSwipe from '../components/MapSwipe';
import ModalCompareTree from '../components/ModalCompareTree';
import MapCompare from '../components/MapCompare';
import MapBottom from '../components/MapBottom';

import style from './style.css'

const MyBasemap = React.lazy(() => import('../components/MyBasemap'));



export default class GlobeMapShow extends React.Component {
  constructor() {
    super();
    this.state = {
      mapView: null,
      renderMeasure: false,
      renderSwipe: false, // Swipe内容框
      swipeLayersArray: [], // Swipe选择的图层列表
      showSwipeModal: false, // Swipe Model选择框
      renderCompare: false, // Compare 内容框
      compareLayersArray: [], // Compare选择的图层列表
      showCompareModal: false,// Compare Model选择框
      featrueGraphic: null // 传入Featrue的图斑编码
    };
  }

  addFeature2Cmp = graphic => {
    this.setState({
      renderCompare: true,
      featrueGraphic: graphic
    })
  }

  handleMenuClick = ({ key }) => {
    switch (key) {
      case 'cl':
        this.setState(prevState => ({
          renderMeasure: !prevState.renderMeasure
        }));
        break;
      case 'jl':
        this.setState(prevState => ({
          showSwipeModal: !prevState.showSwipeModal
        }));
        break;
      case 'dp':
        this.setState(prevState => ({
          showCompareModal: !prevState.showCompareModal
        }));
        break;
      default:
        break;
    }
  }

  handleMenuClose = () => {

    this.setState(prevState => ({
      showMeasure: !prevState.showMeasure
    }));
  }

  onSetCompare = layersArray => {
    if (layersArray.length > 0)
      this.setState({
        showCompareModal: false,
        renderCompare: true,
        compareLayersArray: layersArray
      })
    else
      this.setState({
        showCompareModal: false,
        renderCompare: false
      })
  }

  onSetSwipe = (layersArray, rCount) => {
    if (rCount === 2)
      this.setState({
        showSwipeModal: false,
        renderSwipe: true,
        swipeLayersArray: layersArray
      })
    else if (rCount === -1)
      this.setState({
        showSwipeModal: false,
        renderSwipe: false,
      })
    else
      message.info("请选择两幅栅格影像")


  }

  render() {
    return (
      <>
        <Affix className={style.menu} offsetTop={80}>
          <Button.Group>
            <Dropdown overlay={
              <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="cl" >
                  <Icon type="user" />
                  测量
               </Menu.Item>
                <Menu.Item key="2">
                  <Icon type="user" />
                  全屏
               </Menu.Item>
                <Menu.Item key="3">
                  <Icon type="user" />
                  截图
               </Menu.Item>
                <Menu.Item key="43">
                  <Icon type="user" />
                  打印
               </Menu.Item>
              </Menu>
            } >
              <Button icon="tool" >常用</Button>
            </Dropdown>
            <Dropdown overlay={
              <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="cl" >
                  <Icon type="user" />
                  点选
             </Menu.Item>
              </Menu>
            }>
              <Button icon="info-circle">查询</Button>
            </Dropdown>
            <Dropdown overlay={
              <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="jl" >
                  <Icon type="user" />
                  卷帘
             </Menu.Item>
                <Menu.Item key="dp">
                  <Icon type="user" />
                  多屏
             </Menu.Item>
              </Menu>
            }>
              <Button icon="snippets">分析</Button>
            </Dropdown>
          </Button.Group>
        </Affix>
        <Affix className={style.search} offsetTop={80}>
          <SearchGIS addFeature={this.addFeature2Cmp} view={this.state.mapView} />
        </Affix>
        <Affix className={style.compass} offsetBottom={50} >
          <Compass view={this.state.mapView} />
        </Affix>
        <Affix className={style.measureCard} style={{ visibility: this.state.renderMeasure ? 'visible' : 'hidden' }} offsetTop={150}>
          <Card size="small" title="选择测量工具" extra={<a onClick={
            () => this.setState({
              renderMeasure: false
            })
          }>X</a>} style={{ width: 300 }}>
            <MapMeasure view={this.state.mapView} showMeasure={this.state.renderMeasure} />
          </Card>
        </Affix>

        {
          this.state.showSwipeModal ? (
            <ModalSwipeTree onSetSwipe={this.onSetSwipe} />
          ) : null
        }

        {
          this.state.renderSwipe ? (
            <Affix className={style.mapSwipe} offsetTop={80}>
              <Card size="small" title="卷帘工具" extra={<a onClick={
                () => this.setState({
                  renderSwipe: false
                })
              }>X</a>}>
                <MapSwipe layersArray={this.state.swipeLayersArray} />
              </Card>

            </Affix>
          ) : null
        }

        {
          this.state.showCompareModal ? (
            <ModalCompareTree onSetCompare={this.onSetCompare} />
          ) : null
        }

        {
          this.state.renderCompare ? (
            <Affix className={style.mapCompare} offsetTop={80}>
              <Card size="small" title="多屏工具" extra={<a onClick={
                () => this.setState({
                  renderCompare: false,
                  featrueGraphic:null
                })
              }>X</a>}>
                <MapCompare featrueGraphic={this.state.featrueGraphic} layersArray={this.state.compareLayersArray} />
              </Card>
            </Affix>
          ) : null
        }

        {
          this.state.mapView ? (
            <Affix className={style.mapBottom}>
              <MapBottom mapView={this.state.mapView} />
            </Affix>
          ) : null
        }


        <Row style={{ margin: '-24px' }}>
          <Col span={24}>
            <Suspense fallback="...loading">
              <MyBasemap
                height="calc(100vh - 64px)"
                style={{ overflow: "hidden" }}
                handleLoad={(map, view) => {
                  this.setState({ mapView: view });
                  view.ui.remove("zoom");
                }}
              >
              </MyBasemap>

            </Suspense>
          </Col>
        </Row>
      </>
    )
  }
} 
